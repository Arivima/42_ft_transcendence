/*
  Warnings:

  - Added the required column `founderID` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('public', 'direct');

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "founderID" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Achievement" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "picture" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Plays" (
    "win_host" BOOLEAN NOT NULL,
    "mode" "GameMode" NOT NULL,
    "duration_sec" INTEGER NOT NULL,
    "hostID" INTEGER NOT NULL,
    "guestID" INTEGER NOT NULL,

    CONSTRAINT "Plays_pkey" PRIMARY KEY ("hostID","guestID")
);

-- CreateTable
CREATE TABLE "Subscribed" (
    "isAdmin" BOOLEAN NOT NULL,
    "isMuted" BOOLEAN NOT NULL,
    "isBanned" BOOLEAN NOT NULL,
    "playerID" INTEGER NOT NULL,
    "chatroomID" INTEGER NOT NULL,

    CONSTRAINT "Subscribed_pkey" PRIMARY KEY ("playerID","chatroomID")
);

-- CreateTable
CREATE TABLE "BeFriends" (
    "are_friends" BOOLEAN NOT NULL,
    "pending_friendship" BOOLEAN NOT NULL,
    "requestor_blacklisted" BOOLEAN NOT NULL,
    "recipient_blacklisted" BOOLEAN NOT NULL,
    "requestorID" INTEGER NOT NULL,
    "recipientID" INTEGER NOT NULL,

    CONSTRAINT "BeFriends_pkey" PRIMARY KEY ("requestorID","recipientID")
);

-- CreateTable
CREATE TABLE "Achieved" (
    "playerID" INTEGER NOT NULL,
    "achievementName" TEXT NOT NULL,
    "date_of_issue" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achieved_pkey" PRIMARY KEY ("playerID","achievementName")
);

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_founderID_fkey" FOREIGN KEY ("founderID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plays" ADD CONSTRAINT "Plays_hostID_fkey" FOREIGN KEY ("hostID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plays" ADD CONSTRAINT "Plays_guestID_fkey" FOREIGN KEY ("guestID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribed" ADD CONSTRAINT "Subscribed_playerID_fkey" FOREIGN KEY ("playerID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribed" ADD CONSTRAINT "Subscribed_chatroomID_fkey" FOREIGN KEY ("chatroomID") REFERENCES "ChatRoom"("groupID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeFriends" ADD CONSTRAINT "BeFriends_requestorID_fkey" FOREIGN KEY ("requestorID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeFriends" ADD CONSTRAINT "BeFriends_recipientID_fkey" FOREIGN KEY ("recipientID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achieved" ADD CONSTRAINT "Achieved_playerID_fkey" FOREIGN KEY ("playerID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achieved" ADD CONSTRAINT "Achieved_achievementName_fkey" FOREIGN KEY ("achievementName") REFERENCES "Achievement"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
