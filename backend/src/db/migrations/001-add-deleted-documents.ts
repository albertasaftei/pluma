import type { Migration } from "../migrations";

export const addDeletedDocuments: Migration = {
  id: 1,
  name: "add-deleted-documents",
  up: (db) => {
    // Check if columns already exist
    const tableInfo = db
      .prepare("PRAGMA table_info(documents)")
      .all() as Array<{
      name: string;
    }>;
    const columnNames = tableInfo.map((col) => col.name);

    // Add deleted tracking columns only if they don't exist
    if (!columnNames.includes("deleted")) {
      db.exec(`ALTER TABLE documents ADD COLUMN deleted INTEGER DEFAULT 0;`);
      console.log("  ✅ Added 'deleted' column");
    } else {
      console.log("  ⏭️  Column 'deleted' already exists, skipping");
    }

    if (!columnNames.includes("deleted_at")) {
      db.exec(`ALTER TABLE documents ADD COLUMN deleted_at DATETIME;`);
      console.log("  ✅ Added 'deleted_at' column");
    } else {
      console.log("  ⏭️  Column 'deleted_at' already exists, skipping");
    }

    if (!columnNames.includes("deleted_by")) {
      db.exec(
        `ALTER TABLE documents ADD COLUMN deleted_by INTEGER REFERENCES users(id);`,
      );
      console.log("  ✅ Added 'deleted_by' column");
    } else {
      console.log("  ⏭️  Column 'deleted_by' already exists, skipping");
    }

    // Create index for deleted documents (IF NOT EXISTS handles duplicates)
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_documents_deleted ON documents(organization_id, deleted);
    `);
    console.log("  ✅ Created index for deleted documents");

    console.log("✅ Migration 001: Deleted document tracking configured");
  },
  down: (db) => {
    // Note: SQLite doesn't support DROP COLUMN directly
    // In production, you'd need to recreate the table
    console.log("⚠️  Migration 001 rollback: Manual table recreation required");
  },
};
