/*
  Warnings:

  - You are about to drop the column `musicalGenre` on the `musics` table. All the data in the column will be lost.
  - Added the required column `musicalGenreId` to the `musics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "musics" DROP COLUMN "musicalGenre",
ADD COLUMN     "musicalGenreId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "musics" ADD CONSTRAINT "musics_musicalGenreId_fkey" FOREIGN KEY ("musicalGenreId") REFERENCES "musicalGenres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
