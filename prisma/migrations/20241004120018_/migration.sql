-- CreateTable
CREATE TABLE "musics" (
    "id" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artwork" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "musics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likes" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "photoURL" TEXT NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musicalGenres" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artistId" TEXT,

    CONSTRAINT "musicalGenres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArtistToMusic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArtistToMusic_AB_unique" ON "_ArtistToMusic"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtistToMusic_B_index" ON "_ArtistToMusic"("B");

-- AddForeignKey
ALTER TABLE "musicalGenres" ADD CONSTRAINT "musicalGenres_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToMusic" ADD CONSTRAINT "_ArtistToMusic_A_fkey" FOREIGN KEY ("A") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToMusic" ADD CONSTRAINT "_ArtistToMusic_B_fkey" FOREIGN KEY ("B") REFERENCES "musics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
