/*
  Warnings:

  - You are about to drop the column `assigneeId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Status` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardId` to the `Status` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_assigneeId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "assigneeId",
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "statusId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Status" DROP COLUMN "color",
ADD COLUMN     "boardId" TEXT NOT NULL,
ALTER COLUMN "name" SET DEFAULT 'Draft';

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_slug_key" ON "Board"("slug");

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
