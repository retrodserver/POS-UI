import { describe, expect, it } from "vitest";
import { cleanParams } from "../common";

describe("cleanParams", () => {
  it("omits undefined, null, and empty string", () => {
    expect(
      cleanParams({
        page: 1,
        search: "",
        order_by: undefined,
        status: null,
        name: "ok",
      }),
    ).toEqual({ page: 1, name: "ok" });
  });
});
