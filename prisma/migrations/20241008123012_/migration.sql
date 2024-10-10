/*
  Warnings:

  - You are about to drop the `_MusicGenres` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `musicalGenre` to the `musics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MusicGenres" DROP CONSTRAINT "_MusicGenres_A_fkey";

-- DropForeignKey
ALTER TABLE "_MusicGenres" DROP CONSTRAINT "_MusicGenres_B_fkey";

-- AlterTable
ALTER TABLE "musics" ADD COLUMN     "musicalGenre" TEXT NOT NULL;

-- DropTable
DROP TABLE "_MusicGenres";
