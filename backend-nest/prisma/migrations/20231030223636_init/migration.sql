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
    "receiverSID" INTEGER,

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
    "matchID" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score_host" INTEGER NOT NULL,
    "score_Guest" INTEGER NOT NULL,
    "mode" "GameMode" NOT NULL,
    "duration_sec" INTEGER NOT NULL,
    "hostID" INTEGER NOT NULL,
    "guestID" INTEGER NOT NULL,

    CONSTRAINT "Plays_pkey" PRIMARY KEY ("matchID")
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
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverSID_fkey" FOREIGN KEY ("receiverSID") REFERENCES "ChatRoom"("groupID") ON DELETE SET NULL ON UPDATE CASCADE;

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

--- Inserting Users
INSERT INTO "Player" (
	"createdAt",
	"updatedAt",
	"id",
	"username",
	"avatar",
	"firstName",
	"lastName",
	"profileIntra"
)
VALUES (
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP,
	1,
	'pippo',
	'https://www.ventennipaperoni.com/wp-content/uploads/2020/03/volto-pippo-e1584113937806.jpg', 'pippo',
	'pippi',
	'https://api.intra.42.fr/v2/users/mmarinell'
)
ON CONFLICT DO NOTHING;

INSERT INTO "Player" (
	"createdAt",
	"updatedAt",
	"id",
	"username",
	"avatar",
	"firstName",
	"lastName",
	"profileIntra"
)
VALUES (
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP,
	2,
	'pluto',
	'https://store.modamerceria.it/8021-thickbox_default/pluto-disney-applicazione-patch-ricamata-e-termoadesiva.jpg',
	'pluto',
	'plutini',
	'https://api.intra.42.fr/v2/users/mmarinell'
)
ON CONFLICT DO NOTHING;

INSERT INTO "Player" (
	"createdAt",
	"updatedAt",
	"id",
	"username",
	"avatar",
	"firstName",
	"lastName",
	"profileIntra"
)
VALUES (
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP,
	3,
	'paperino',
	'https://store.modamerceria.it/8023/zio-paperino-disney-applicazione-patch-ricamata-e-termoadesiva.jpg',
	'paperino',
	'de paperini',
	'https://api.intra.42.fr/v2/users/mmarinell'
)
ON CONFLICT DO NOTHING;

INSERT INTO "Player" (
	"createdAt",
	"updatedAt",
	"id",
	"username",
	"avatar",
	"firstName",
	"lastName",
	"profileIntra"
)
VALUES (
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP,
	99696,
	'mmarinel',
	'https://cdn.intra.42.fr/users/b0b7a8da1b0909115e781960cca2a3ea/mmarinel.jpeg',
	'Matteo',
	'Marinelli',
	'https://api.intra.42.fr/v2/users/mmarinel'
)
ON CONFLICT DO NOTHING;

-- Adding Friends
INSERT INTO "BeFriends" (
	"are_friends",
	"pending_friendship",
	"requestor_blacklisted",
	"recipient_blacklisted",
	"requestorID",
	"recipientID"
)
VALUES (
	true,
	false,
	false,
	false,
	99696,
	1
)
ON CONFLICT DO NOTHING;

INSERT INTO "BeFriends" (
	"are_friends",
	"pending_friendship",
	"requestor_blacklisted",
	"recipient_blacklisted",
	"requestorID",
	"recipientID"
)
VALUES (
	true,
	false,
	false,
	false,
	99696,
	2
)
ON CONFLICT DO NOTHING;

INSERT INTO "BeFriends" (
	"are_friends",
	"pending_friendship",
	"requestor_blacklisted",
	"recipient_blacklisted",
	"requestorID",
	"recipientID"
)
VALUES (
	true,
	false,
	false,
	false,
	99696,
	3
)
ON CONFLICT DO NOTHING;

--- Adding Matches
INSERT INTO "Plays" (
	"createdAt",
	"score_host",
	"score_Guest",
	"mode",
	"duration_sec",
	"hostID",
	"guestID"
)
VALUES (
	CURRENT_TIMESTAMP,
	6,
	1,
	'public',
	3600,
	99696,
	1
)
ON CONFLICT DO NOTHING;

INSERT INTO "Plays" (
	"createdAt",
	"score_host",
	"score_Guest",
	"mode",
	"duration_sec",
	"hostID",
	"guestID"
)
VALUES (
	CURRENT_TIMESTAMP,
	4,
	0,
	'public',
	3600,
	2,
	99696
)
ON CONFLICT DO NOTHING;

INSERT INTO "Plays" (
	"createdAt",
	"score_host",
	"score_Guest",
	"mode",
	"duration_sec",
	"hostID",
	"guestID"
)
VALUES (
	CURRENT_TIMESTAMP,
	4,
	4,
	'public',
	3600,
	3,
	99696
)
ON CONFLICT DO NOTHING;

INSERT INTO "Plays" (
	"createdAt",
	"score_host",
	"score_Guest",
	"mode",
	"duration_sec",
	"hostID",
	"guestID"
)
VALUES (
	CURRENT_TIMESTAMP,
	4,
	6,
	'direct',
	3600,
	99696,
	3
)
ON CONFLICT DO NOTHING;
