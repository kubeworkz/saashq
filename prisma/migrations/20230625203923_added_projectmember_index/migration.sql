/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ProjectMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_userId_key" ON "ProjectMember"("userId");