import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LinkEvidenceService } from "./LinkEvidenceService.js";

describe("LinkEvidenceService", () => {
  it("drops malformed script blocks when converting linked HTML to text", async () => {
    const service = new LinkEvidenceService(
      {
        extract() {
          return {
            urls: ["https://example.com/release-notes"],
          };
        },
      },
      {
        info() {},
      },
      async () => ({
        ok: true,
        async text() {
          return [
            "<html><body>",
            "<h1>Release Notes</h1>",
            '<script>alert("xss")</script foo="bar">',
            "<p>Visible summary text.</p>",
            "</body></html>",
          ].join("");
        },
      }),
    );

    const evidence = await service.collect(
      "BREAKING: see https://example.com/release-notes",
    );

    assert.match(evidence, /^https:\/\/example.com\/release-notes\n/);
    assert.match(evidence, /visible summary text\./i);
    assert.doesNotMatch(evidence, /alert\("xss"\)/);
    assert.doesNotMatch(evidence, /script foo/);
  });
});
