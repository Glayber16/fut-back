/*
  Warnings:

  - You are about to drop the column `placar` on the `partidas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "partidas" DROP COLUMN "placar",
ADD COLUMN     "placarCasa" INTEGER,
ADD COLUMN     "placarFora" INTEGER;
