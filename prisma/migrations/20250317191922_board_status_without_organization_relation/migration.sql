/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Post` table. All the data in the column will be lost.
  - Added the required column `boardId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_organizationId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "organizationId",
DROP COLUMN "published",
ADD COLUMN     "boardId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
