/*
  Warnings:

  - You are about to drop the `_ArtistToGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ArtistToGenre" DROP CONSTRAINT "_ArtistToGenre_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistToGenre" DROP CONSTRAINT "_ArtistToGenre_B_fkey";

-- DropTable
DROP TABLE "_ArtistToGenre";

-- CreateTable
CREATE TABLE "artist_genres" (
    "artist_id" TEXT NOT NULL,
    "genre_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artist_genres_pkey" PRIMARY KEY ("artist_id","genre_id")
);

-- CreateIndex
CREATE INDEX "artist_genres_genre_id_idx" ON "artist_genres"("genre_id");

-- AddForeignKey
ALTER TABLE "artist_genres" ADD CONSTRAINT "artist_genres_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_genres" ADD CONSTRAINT "artist_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
