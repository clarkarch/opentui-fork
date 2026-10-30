import { Renderable, type RenderableOptions, type NativeRenderableIntegration } from "../Renderable.js";
import { NativeImage, type ImageSource } from "../image.js";
import type { OptimizedBuffer } from "../buffer.js";
import type { ImageRenderProtocol, RenderContext, TerminalCapabilities } from "../types.js";
export type ImageFit = "fit" | "cover" | "fill";
export type ImageRenderableSource = ImageSource | NativeImage;
export interface ImageRenderableOptions extends RenderableOptions<ImageRenderable> {
    source?: ImageRenderableSource;
    fit?: ImageFit;
    protocol?: ImageRenderProtocol;
    /** tfm fork (scrims): 0..1 replaces the inherited render-tree opacity for this
     * image's placements (survives a dimmed ancestor, e.g. a modal scrim); leaving
     * it null inherits the node opacity exactly as before. */
    placementOpacity?: number | null;
    onLoad?: (image: NativeImage) => void;
    onError?: (error: unknown) => void;
}
export declare function resolveImageRenderProtocol(requested: ImageRenderProtocol, capabilities: TerminalCapabilities | null, hasResolution: boolean): Exclude<ImageRenderProtocol, "auto">;
export declare class ImageRenderable extends Renderable {
    static readonly nativeIntegration: NativeRenderableIntegration;
    private _source;
    private _image;
    private _pendingImage;
    private _loadError;
    private _loadController;
    onLoad?: (image: NativeImage) => void;
    onError?: (error: unknown) => void;
    private _fit;
    private _protocol;
    private _placementOpacity;
    loadPromise: Promise<void> | null;
    constructor(ctx: RenderContext, options: ImageRenderableOptions);
    get source(): ImageRenderableSource | undefined;
    set source(source: ImageRenderableSource | undefined);
    get image(): NativeImage | null;
    get fit(): ImageFit;
    set fit(value: ImageFit | null | undefined);
    get protocol(): ImageRenderProtocol;
    set protocol(value: ImageRenderProtocol | null | undefined);
    /** tfm fork (scrims): placement-level opacity override, see placementOpacity. */
    get placementOpacity(): number | null;
    set placementOpacity(value: number | null | undefined);
    get effectiveProtocol(): Exclude<ImageRenderProtocol, "auto">;
    get cellAspectRatio(): number;
    getFittedSize(targetWidth: number, targetHeight: number, cellAspectRatio?: number, sourceWidth?: number, sourceHeight?: number): {
        width: number;
        height: number;
    };
    get loading(): boolean;
    get loadError(): unknown;
    protected createFrameBuffer(): void;
    protected renderSelf(buffer: OptimizedBuffer): void;
    private load;
    private setNativeSceneImage;
    protected destroySelf(): void;
}
