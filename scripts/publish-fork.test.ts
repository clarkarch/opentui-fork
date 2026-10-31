import { expect, test } from "bun:test"
import { planPublish, type PublishCandidate } from "./publish-fork"

function candidate(id: string, state: PublishCandidate["state"]): PublishCandidate {
  return { id, directory: `/tmp/${id}`, state }
}

test("a package npm does not have is published", () => {
  const plan = planPublish([candidate("pkg@1.0.0", "missing")])

  expect(plan.publish).toEqual(["/tmp/pkg@1.0.0"])
  expect(plan.skipped).toEqual([])
})

test("a package npm already has is skipped, even with different contents", () => {
  // npm cannot republish a version, and the native libraries are rebuilt on
  // every run, so a rerun of a published release always sees different bytes.
  // Failing there would make a partial release impossible to resume.
  const plan = planPublish([candidate("pkg@1.0.0", "identical"), candidate("other@1.0.0", "different")])

  expect(plan.publish).toEqual([])
  expect(plan.skipped.map((entry) => entry.id)).toEqual(["pkg@1.0.0", "other@1.0.0"])
})

test("only the missing packages are published, in order", () => {
  const plan = planPublish([
    candidate("native-a@1.0.0", "missing"),
    candidate("native-b@1.0.0", "different"),
    candidate("core@1.0.0", "missing"),
  ])

  // The order matters: the native packages have to be on npm before the core
  // that depends on them.
  expect(plan.publish).toEqual(["/tmp/native-a@1.0.0", "/tmp/core@1.0.0"])
  expect(plan.skipped.map((entry) => entry.id)).toEqual(["native-b@1.0.0"])
})
