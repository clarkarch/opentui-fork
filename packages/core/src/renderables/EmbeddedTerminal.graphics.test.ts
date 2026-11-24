import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { createTestRenderer, type TestRendererSetup } from "../testing/test-renderer.js"
import { EmbeddedTerminalRenderable } from "./EmbeddedTerminal.js"

// The kitty graphics protocol query the OpenTUI renderer sends at boot.
const GRAPHICS_QUERY = "\x1b_Gi=31337,s=1,v=1,a=q,t=d,f=24;AAAA\x1b\\"

// A 2x2 PNG, base64 encoded the way the kitty protocol transmits it.
const PNG_2x2 = "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEElEQVR4nGP4z8DwHwohFABFzAf5Zsv/OQAAAABJRU5ErkJggg=="

describe("EmbeddedTerminalRenderable graphics", () => {
  let setup: TestRendererSetup

  beforeEach(async () => {
    setup = await createTestRenderer({ width: 30, height: 8 })
  })

  afterEach(() => setup.renderer.destroy())

  test("answers the kitty graphics query", async () => {
    const out: string[] = []
    const terminal = new EmbeddedTerminalRenderable(setup.renderer, {
      width: 20,
      height: 4,
      onData: (data) => out.push(new TextDecoder().decode(data)),
    })
    setup.renderer.root.add(terminal)
    terminal.write(GRAPHICS_QUERY)
    await setup.renderOnce()
    expect(out.join("")).toContain("i=31337;OK")
  })

  test("accepts a kitty PNG transmission instead of rejecting the format", async () => {
    const out: string[] = []
    const terminal = new EmbeddedTerminalRenderable(setup.renderer, {
      width: 20,
      height: 4,
      onData: (data) => out.push(new TextDecoder().decode(data)),
    })
    setup.renderer.root.add(terminal)
    terminal.write(`\x1b_Ga=T,f=100,i=9;${PNG_2x2}\x1b\\`)
    await setup.renderOnce()
    // A rejected transmission answers with an error, an accepted one stays
    // quiet (the transmission was not marked quiet).
    expect(out.join("")).not.toContain("EINVAL")
  })

  test("draws a transmitted kitty image into the pane", async () => {
    const terminal = new EmbeddedTerminalRenderable(setup.renderer, { width: 20, height: 4 })
    setup.renderer.root.add(terminal)
    terminal.write(`\x1b_Ga=T,f=100,i=9;${PNG_2x2}\x1b\\`)
    await setup.renderOnce()
    // Without a graphics capable host the image is materialized as block
    // glyphs, so the pane's first cell carries the picture instead of a space.
    const frame = setup.captureCharFrame()
    expect(frame[0]).not.toBe(" ")
    expect(frame[0]?.trim()).not.toBe("")
  })
})
