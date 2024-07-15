/*
  Warnings:

  - You are about to drop the column `tilte` on the `Document` table. All the data in the column will be lost.
  - Added the required column `title` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "direction" INTEGER NOT NULL,
    "documentTypeId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "receiveUnit" TEXT NOT NULL,
    "signer" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "filePath" TEXT,
    "createdBy" TEXT NOT NULL,
    "needApproval" BOOLEAN NOT NULL,
    "approveBy" TEXT,
    "approvalDeadline" TEXT,
    "replyTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_documentTypeId_fkey" FOREIGN KEY ("documentTypeId") REFERENCES "DocumentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Document_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Document_approveBy_fkey" FOREIGN KEY ("approveBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Document_replyTo_fkey" FOREIGN KEY ("replyTo") REFERENCES "Document" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Document" ("approvalDeadline", "approveBy", "code", "content", "createdAt", "createdBy", "date", "description", "direction", "documentTypeId", "filePath", "id", "needApproval", "quantity", "receiveUnit", "receiver", "replyTo", "signer", "updatedAt") SELECT "approvalDeadline", "approveBy", "code", "content", "createdAt", "createdBy", "date", "description", "direction", "documentTypeId", "filePath", "id", "needApproval", "quantity", "receiveUnit", "receiver", "replyTo", "signer", "updatedAt" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
CREATE UNIQUE INDEX "Document_code_key" ON "Document"("code");
CREATE UNIQUE INDEX "Document_replyTo_key" ON "Document"("replyTo");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
