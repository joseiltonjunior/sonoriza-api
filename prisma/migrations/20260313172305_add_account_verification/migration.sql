-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "account_status" "AccountStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
ADD COLUMN     "email_verified_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "account_verifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "resend_available_at" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 5,
    "verified_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "account_verifications_user_id_idx" ON "account_verifications"("user_id");

-- CreateIndex
CREATE INDEX "account_verifications_expires_at_idx" ON "account_verifications"("expires_at");

-- CreateIndex
CREATE INDEX "account_verifications_revoked_at_idx" ON "account_verifications"("revoked_at");

-- CreateIndex
CREATE INDEX "users_account_status_idx" ON "users"("account_status");

-- AddForeignKey
ALTER TABLE "account_verifications" ADD CONSTRAINT "account_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
