-- AlterTable
ALTER TABLE "users"
ADD COLUMN     "photo_url" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");
