/*
  Warnings:

  - You are about to drop the column `musicId` on the `artists` table. All the data in the column will be lost.
  - You are about to drop the column `artistId` on the `musicalGenres` table. All the data in the column will be lost.
  - You are about to drop the column `musicId` on the `musicalGenres` table. All the data in the column will be lost.
  - You are about to drop the column `musicalGenreId` on the `musics` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "artists" DROP CONSTRAINT "artists_musicId_fkey";

-- DropForeignKey
ALTER TABLE "musicalGenres" DROP CONSTRAINT "musicalGenres_artistId_fkey";

-- DropForeignKey
ALTER TABLE "musicalGenres" DROP CONSTRAINT "musicalGenres_musicId_fkey";

-- AlterTable
ALTER TABLE "artists" DROP COLUMN "musicId";

-- AlterTable
ALTER TABLE "musicalGenres" DROP COLUMN "artistId",
DROP COLUMN "musicId";

-- AlterTable
ALTER TABLE "musics" DROP COLUMN "musicalGenreId";

-- CreateTable
CREATE TABLE "_MusicGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ArtistMusic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MusicGenres_AB_unique" ON "_MusicGenres"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicGenres_B_index" ON "_MusicGenres"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArtistMusic_AB_unique" ON "_ArtistMusic"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtistMusic_B_index" ON "_ArtistMusic"("B");

-- AddForeignKey
ALTER TABLE "_MusicGenres" ADD CONSTRAINT "_MusicGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "musics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MusicGenres" ADD CONSTRAINT "_MusicGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "musicalGenres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistMusic" ADD CONSTRAINT "_ArtistMusic_A_fkey" FOREIGN KEY ("A") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistMusic" ADD CONSTRAINT "_ArtistMusic_B_fkey" FOREIGN KEY ("B") REFERENCES "musics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
