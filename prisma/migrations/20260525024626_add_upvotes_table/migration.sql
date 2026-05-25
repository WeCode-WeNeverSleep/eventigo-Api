/*
  Warnings:

  - You are about to drop the column `upvotes` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "upvotes";

-- CreateTable
CREATE TABLE "Upvote" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_questionId_key" ON "Upvote"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
