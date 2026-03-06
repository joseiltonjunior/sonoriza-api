/*
  Warnings:

  - You are about to drop the column `like` on the `artists` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `musics` table. All the data in the column will be lost.
  - You are about to drop the column `view` on the `musics` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "artists" DROP COLUMN "like",
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "musics" DROP COLUMN "like",
DROP COLUMN "view",
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_likes" (
    "user_id" TEXT NOT NULL,
    "music_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "music_likes_pkey" PRIMARY KEY ("user_id","music_id")
);

-- CreateTable
CREATE TABLE "artist_likes" (
    "user_id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artist_likes_pkey" PRIMARY KEY ("user_id","artist_id")
);

-- CreateTable
CREATE TABLE "music_views" (
    "id" TEXT NOT NULL,
    "music_id" TEXT NOT NULL,
    "user_id" TEXT,
    "ip_hash" TEXT,
    "user_agent_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "music_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "music_likes_music_id_idx" ON "music_likes"("music_id");

-- CreateIndex
CREATE INDEX "music_likes_created_at_idx" ON "music_likes"("created_at");

-- CreateIndex
CREATE INDEX "artist_likes_artist_id_idx" ON "artist_likes"("artist_id");

-- CreateIndex
CREATE INDEX "artist_likes_created_at_idx" ON "artist_likes"("created_at");

-- CreateIndex
CREATE INDEX "music_views_music_id_idx" ON "music_views"("music_id");

-- CreateIndex
CREATE INDEX "music_views_user_id_idx" ON "music_views"("user_id");

-- CreateIndex
CREATE INDEX "music_views_created_at_idx" ON "music_views"("created_at");

-- CreateIndex
CREATE INDEX "music_views_music_id_created_at_idx" ON "music_views"("music_id", "created_at");

-- CreateIndex
CREATE INDEX "artists_deleted_at_idx" ON "artists"("deleted_at");

-- CreateIndex
CREATE INDEX "musics_created_at_idx" ON "musics"("created_at");

-- CreateIndex
CREATE INDEX "musics_release_date_idx" ON "musics"("release_date");

-- CreateIndex
CREATE INDEX "musics_deleted_at_idx" ON "musics"("deleted_at");

-- AddForeignKey
ALTER TABLE "music_likes" ADD CONSTRAINT "music_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_likes" ADD CONSTRAINT "music_likes_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "musics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_likes" ADD CONSTRAINT "artist_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_likes" ADD CONSTRAINT "artist_likes_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_views" ADD CONSTRAINT "music_views_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "musics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_views" ADD CONSTRAINT "music_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
