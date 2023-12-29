-- CreateEnum
CREATE TYPE "ChatStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "waChatId" TEXT NOT NULL,
    "openaiThreadId" TEXT NOT NULL,
    "status" "ChatStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_openaiThreadId_key" ON "Chat"("openaiThreadId");
