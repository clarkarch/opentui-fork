import type { BaseRenderable } from "../Renderable.js";
/**
 * Writes one framework prop to a renderable; `prev` is the value of the previous write. The React and Solid
 * reconcilers call it, so a sequence of writes leaves the same state in both.
 *
 * `focused` focuses or blurs a node that can take focus. `onChange`, `onInput`, `onSubmit`, and `onSelect` replace
 * a listener (remove, then add) where the node emits a matching event. `style` writes its changed keys and writes
 * `undefined` to each key it no longer has. Any other prop, unmapped event props included, is assigned.
 */
export declare function setRenderableProp(node: BaseRenderable, name: string, value: any, prev: any): void;
