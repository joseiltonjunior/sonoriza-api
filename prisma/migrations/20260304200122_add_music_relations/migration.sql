-- CreateTable
CREATE TABLE "musics" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "album" TEXT,
    "cover_path" TEXT,
    "audio_path" TEXT NOT NULL,
    "color" TEXT,
    "duration_seconds" INTEGER,
    "release_date" TIMESTAMP(3),
    "genre_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "musics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "musics_slug_key" ON "musics"("slug");

-- CreateIndex
CREATE INDEX "musics_genre_id_idx" ON "musics"("genre_id");
