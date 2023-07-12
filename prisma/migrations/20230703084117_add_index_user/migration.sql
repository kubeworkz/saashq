-- DropIndex
DROP INDEX IF EXISTS "ProjectMember_userId_key";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ProjectMember_userId_idx" ON "ProjectMember"("userId");
