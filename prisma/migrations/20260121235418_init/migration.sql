-- CreateEnum
CREATE TYPE "ResultadoPartida" AS ENUM ('VITORIA', 'DERROTA', 'EMPATE');

-- CreateTable
CREATE TABLE "colegas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "colegas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partidas" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "timeCasa" TEXT NOT NULL,
    "rival" TEXT NOT NULL,
    "escudoTimeCasa" TEXT,
    "escudoRival" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "campeonato" TEXT NOT NULL,
    "estadio" TEXT NOT NULL,
    "placar" TEXT,
    "resultado" "ResultadoPartida",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ColegaToPartida" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ColegaToPartida_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "colegas_nome_key" ON "colegas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "partidas_externalId_key" ON "partidas"("externalId");

-- CreateIndex
CREATE INDEX "_ColegaToPartida_B_index" ON "_ColegaToPartida"("B");

-- AddForeignKey
ALTER TABLE "_ColegaToPartida" ADD CONSTRAINT "_ColegaToPartida_A_fkey" FOREIGN KEY ("A") REFERENCES "colegas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColegaToPartida" ADD CONSTRAINT "_ColegaToPartida_B_fkey" FOREIGN KEY ("B") REFERENCES "partidas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
