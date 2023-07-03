-- DropIndex
DROP INDEX "ProjectMember_userId_key";

-- CreateIndex
CREATE INDEX "ProjectMember_userId_idx" ON "ProjectMember"("userId");