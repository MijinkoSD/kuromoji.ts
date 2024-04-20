import { describe, it, expect } from "vitest";
import { pathJoin } from "../../src/util/PathJoin";

describe("PathJoin", () => {
  it("basic", () => {
    const dir = "foo/";
    const file = "bar.gz";
    const path = pathJoin([dir, file]);

    const expected = "foo/bar.gz";
    expect(path).equals(expected);
  });
  it("absolute path", () => {
    const dir = "/foo/";
    const file = "bar.gz";
    const path = pathJoin([dir, file]);

    const expected = "/foo/bar.gz";
    expect(path).equals(expected);
  });
  it("duplicate slash", () => {
    const dir = "foo/";
    const file = "/bar.gz";
    const path = pathJoin([dir, file]);

    const expected = "foo//bar.gz";
    expect(path).equals(expected);
  });
});
