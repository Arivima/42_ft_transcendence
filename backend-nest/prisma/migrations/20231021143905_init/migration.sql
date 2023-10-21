-- CreateEnum
CREATE TYPE "ChatRoomVisibility" AS ENUM ('public', 'private', 'protected');

-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('public', 'direct');

-- CreateTable
CREATE TABLE "Player" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "profileIntra" TEXT,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "twofaSecret" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "messageID" SERIAL NOT NULL,
    "senderID" INTEGER NOT NULL,
    "receiverID" INTEGER NOT NULL,
    "receiverSID" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("messageID")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "visibility" "ChatRoomVisibility" NOT NULL,
    "password" TEXT NOT NULL,
    "founderID" INTEGER NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("groupID")
);

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
    "score_host" INTEGER NOT NULL,
    "score_Guest" INTEGER NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Player_avatar_key" ON "Player"("avatar");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverSID_fkey" FOREIGN KEY ("receiverSID") REFERENCES "ChatRoom"("groupID") ON DELETE RESTRICT ON UPDATE CASCADE;

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


ALTER TABLE "Message"
ADD CONSTRAINT recipients_check
CHECK (
	("receiverID" IS NULL AND "receiverSID" IS NOT NULL) OR
	("receiverSID" IS NULL AND "receiverID" IS NOT NULL)
);
