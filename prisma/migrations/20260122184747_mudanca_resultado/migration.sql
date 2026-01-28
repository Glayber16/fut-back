/*
  Warnings:

  - Made the column `resultado` on table `partidas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "partidas" ALTER COLUMN "resultado" SET NOT NULL;
