import { expect, test } from "bun:test"
import { parsePackIntegrity } from "./npm-publish"

test("the pack report is read in both npm output shapes", () => {
  // npm 11 reports an array, npm 12 keys the report by the package name. The
  // release script runs on whichever npm the runner ships, so it has to read
  // both — the wrong one reads as "no integrity" and fails the release.
  const integrity = "sha512-1StscM6sBmaZ4boo7nlqyoVUrzh4XCNQWO02AtkUv8HLllngbM4U9rTLTdMEXvsWCin0NJuAvP3VjYNAESsw+A=="

  expect(parsePackIntegrity(JSON.stringify([{ id: "pkg@1.0.0", integrity }]))).toBe(integrity)
  expect(parsePackIntegrity(JSON.stringify({ "pkg@1.0.0": { id: "pkg@1.0.0", integrity } }))).toBe(integrity)
})

test("a pack report without an integrity reads as none", () => {
  expect(parsePackIntegrity(JSON.stringify([{ id: "pkg@1.0.0" }]))).toBeUndefined()
  expect(parsePackIntegrity(JSON.stringify({ "pkg@1.0.0": { id: "pkg@1.0.0" } }))).toBeUndefined()
  expect(parsePackIntegrity(JSON.stringify({}))).toBeUndefined()
})
