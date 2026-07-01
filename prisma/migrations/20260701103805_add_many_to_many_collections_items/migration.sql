/*
  Warnings:

  - You are about to drop the column `collectionId` on the `item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_collectionId_fkey";

-- DropIndex
DROP INDEX "item_collectionId_idx";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "collectionId";

-- CreateTable
CREATE TABLE "_CollectionToItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CollectionToItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CollectionToItem_B_index" ON "_CollectionToItem"("B");

-- AddForeignKey
ALTER TABLE "_CollectionToItem" ADD CONSTRAINT "_CollectionToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToItem" ADD CONSTRAINT "_CollectionToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
