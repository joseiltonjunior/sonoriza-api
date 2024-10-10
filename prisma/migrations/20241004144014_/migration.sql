/*
  Warnings:

  - You are about to drop the column `genre` on the `musics` table. All the data in the column will be lost.
  - You are about to drop the `_ArtistToMusic` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `musicalGenreId` to the `musics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ArtistToMusic" DROP CONSTRAINT "_ArtistToMusic_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistToMusic" DROP CONSTRAINT "_ArtistToMusic_B_fkey";

-- AlterTable
ALTER TABLE "artists" ADD COLUMN     "musicId" TEXT;

-- AlterTable
ALTER TABLE "musicalGenres" ADD COLUMN     "musicId" TEXT;

-- AlterTable
ALTER TABLE "musics" DROP COLUMN "genre",
ADD COLUMN     "musicalGenreId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ArtistToMusic";

-- AddForeignKey
ALTER TABLE "musicalGenres" ADD CONSTRAINT "musicalGenres_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "musics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artists" ADD CONSTRAINT "artists_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "musics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
