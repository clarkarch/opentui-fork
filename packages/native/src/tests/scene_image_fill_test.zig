// tfm fork regression pin: the modal scrim overlay is a scene-painted BOX, and
// a plain box fill unreserves every image cell it covers (the "black box"
// icons). The scene must honour BoxRenderable.fillDimsImages
// (ot_scene_set_fill_dims_images -> Node.fill_dims_images -> paintBox ->
// drawBoxCheckedDimmingImages), keeping the placement and scaling its opacity.
//
// This exercises the SCENE paint path end to end; the buffer-level
// drawBoxCheckedDimmingImages test in renderer_test.zig only pins the
// primitive, which is how the scene wiring regression slipped through.
const std = @import("std");
const testing = std.testing;
const context = @import("../context.zig");
const scene = @import("../scene.zig");
const image = @import("../image.zig");
const gp = @import("../grapheme.zig");
const c = @import("context_abi_c");
const repaint = @import("scene_fixture_test.zig").repaint;

const options: scene.FrameOptions = .{
    .background = .{ 0, 0, 0, 255 },
    .use_mouse = true,
    .excluded_hit_num = 0,
    .max_layout_rounds = 8,
    .max_host_requests = 64,
};

const Fixture = struct {
    owner: *context.Context,
    id: context.Handle,
    root: context.Handle,
    picture: context.Handle,
    image_node: context.Handle,
    box: context.Handle,
};

fn setup(owner: *context.Context) !Fixture {
    const id = try owner.createSession(.{ .chunk_size = 4096 });
    try owner.attachSessionRenderer(id, 4, 2, .{ .remote_mode = .remote });
    (try owner.raw().getSessionRenderer(id)).terminal.caps.kitty_graphics = true;
    const root = try owner.sceneCreateNode(id, 0, 1);

    const image_node = try owner.sceneCreateNode(id, c.OT_SCENE_IMAGE, 2);
    try owner.sceneSetPaint(image_node, .{ .zIndex = 0 });
    try owner.sceneSetStyle(image_node, 4, 0, 0, 1, 1, 1);
    try owner.sceneSetStyle(image_node, 4, 1, 0, 1, 1, 1);
    try owner.sceneMoveNode(image_node, root, 0);

    const box = try owner.sceneCreateNode(id, c.OT_SCENE_BOX, 3);
    // absolute full-cover overlay, like the real scrim (default flow would lay
    // it out under the image node instead of over it)
    try owner.sceneSetStyle(box, c.OT_STYLE_ENUM, c.OT_STYLE_ENUM_POSITION_TYPE, 0, 0, c.OT_POSITION_ABSOLUTE, 0);
    try owner.sceneSetStyle(box, 4, 0, 0, 1, 4, 1);
    try owner.sceneSetStyle(box, 4, 1, 0, 1, 2, 1);
    // the classic scrim: a translucent full-cover fill
    try owner.sceneSetPaint(box, .{ .zIndex = 1, .shouldFill = 1, .background = .{ 0, 0, 0, 150 } });
    try owner.sceneMoveNode(box, root, 1);

    const pixels = [_]u8{ 200, 100, 50, 255 };
    const picture = try owner.createImagePixels(&pixels, 1, 1, .{ .stride = 4 });
    try owner.sceneSetImage(image_node, picture, .fit, .kitty, null, -1.0);

    return .{ .owner = owner, .id = id, .root = root, .picture = picture, .image_node = image_node, .box = box };
}

test "tfm fork: a flagged scene box fill keeps and dims the image placements it covers" {
    const owner = try context.Context.init(testing.allocator, testing.io, .{});
    defer owner.deinit() catch unreachable;
    const f = try setup(owner);

    // settle one frame first: a freshly built scene paints nodes more than once
    // in its first frame, which is not what opening a modal does (the overlay
    // is dirtied; the tiles and their placements are not).
    try repaint(owner, f.id, options.background, true, 0);

    try owner.sceneSetFillDimsImages(f.box, true);
    try repaint(owner, f.id, options.background, true, 0);
    const target = (try owner.raw().getSessionRenderer(f.id)).getNextBuffer();
    try testing.expectEqual(@as(usize, 1), target.image_placements.items.len);
    try testing.expectEqual(@as(u8, 150), target.image_placements.items[0].opacity);
    try testing.expect(gp.isImageChar(target.get(0, 0).?.char));

    // Without the flag the same fill covers the placement (historical behavior:
    // a fill unreserves every image cell it covers — the placement survives in
    // the buffer until the frame is encoded, so the cell is the assertion).
    try owner.sceneSetFillDimsImages(f.box, false);
    try repaint(owner, f.id, options.background, true, 0);
    const plain = (try owner.raw().getSessionRenderer(f.id)).getNextBuffer();
    try testing.expect(!gp.isImageChar(plain.get(0, 0).?.char));
}

test "tfm fork: the fill-dims flag binds box nodes only" {
    const owner = try context.Context.init(testing.allocator, testing.io, .{});
    defer owner.deinit() catch unreachable;
    const f = try setup(owner);
    try testing.expectError(error.WrongKind, owner.sceneSetFillDimsImages(f.root, true));
    try testing.expectError(error.WrongKind, owner.sceneSetFillDimsImages(f.image_node, true));
    const doomed = try owner.sceneCreateNode(f.id, c.OT_SCENE_BOX, 9);
    try owner.sceneDestroyNode(doomed);
    try testing.expectError(error.StaleHandle, owner.sceneSetFillDimsImages(doomed, true));
}
