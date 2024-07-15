/*
  Warnings:

  - You are about to drop the column `approvalDeadline` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `approveBy` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `needApproval` on the `Document` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT,
    "direction" INTEGER NOT NULL,
    "documentTypeId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "receiver" TEXT,
    "receiveUnit" TEXT,
    "signer" TEXT,
    "content" TEXT NOT NULL,
    "description" TEXT,
    "filePath" TEXT,
    "createdBy" TEXT NOT NULL,
    "needReply" BOOLEAN NOT NULL DEFAULT false,
    "ignoreReply" BOOLEAN NOT NULL DEFAULT false,
    "replyBy" TEXT,
    "replyDeadline" TEXT,
    "replyTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_documentTypeId_fkey" FOREIGN KEY ("documentTypeId") REFERENCES "DocumentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Document_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Document_replyBy_fkey" FOREIGN KEY ("replyBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Document_replyTo_fkey" FOREIGN KEY ("replyTo") REFERENCES "Document" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Document" ("code", "content", "createdAt", "createdBy", "date", "description", "direction", "documentTypeId", "filePath", "id", "quantity", "receiveUnit", "receiver", "replyTo", "signer", "title", "updatedAt") SELECT "code", "content", "createdAt", "createdBy", "date", "description", "direction", "documentTypeId", "filePath", "id", "quantity", "receiveUnit", "receiver", "replyTo", "signer", "title", "updatedAt" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
CREATE UNIQUE INDEX "Document_code_key" ON "Document"("code");
CREATE UNIQUE INDEX "Document_replyTo_key" ON "Document"("replyTo");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
