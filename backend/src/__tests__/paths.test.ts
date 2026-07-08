import { describe, it, expect, afterAll } from "vitest";
import fs from "fs";
import path from "path";
import {
  getUniqueFilePath,
  getOrgDocumentsPath,
} from "../routes/documents/helpers/paths.js";

const created: string[] = [];

afterAll(() => {
  for (const dir of created) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

function writeExistingFile(organizationId: number, relPath: string) {
  const full = path.join(getOrgDocumentsPath(organizationId), relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, "existing");
  created.push(getOrgDocumentsPath(organizationId));
}

describe("getUniqueFilePath", () => {
  it("preserves no-extension filenames when generating a unique name", async () => {
    const orgId = 9001;
    // A file named "README" (no extension) already exists.
    writeExistingFile(orgId, "README");

    const result = await getUniqueFilePath("README", orgId, true);

    // The original filename must be retained: "README (1)", not " (1)".
    expect(path.basename(result)).toBe("README (1)");
  });

  it("keeps the extension for files that have one", async () => {
    const orgId = 9002;
    writeExistingFile(orgId, "notes.md");

    const result = await getUniqueFilePath("notes.md", orgId, true);

    expect(path.basename(result)).toBe("notes (1).md");
  });
});
