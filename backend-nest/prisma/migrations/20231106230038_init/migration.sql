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
    "receiverID" INTEGER,
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
    "are_friends" BOOLEAN NOT NULL DEFAULT false,
    "pending_friendship" BOOLEAN NOT NULL DEFAULT true,
    "requestor_blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "recipient_blacklisted" BOOLEAN NOT NULL DEFAULT false,
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
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
	'public/upload/pippo.jpg',
	'pippo',
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
	'public/upload/pluto.jpg',
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
	'public/upload/paperino.jpg',
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
	101282,
	'mmarinel',
	'public/upload/Rapunzel.jpg',
	'Matteo',
	'Marinelli',
	'https://api.intra.42.fr/v2/users/mmarinel'
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
	101282,
	'mmarinel',
	'public/upload/Rapunzel.jpg',
	'Matteo',
	'Marinelli',
	'https://api.intra.42.fr/v2/users/mmarinel'
)
ON CONFLICT DO NOTHING;

--- Inserting Achievements
INSERT INTO "Achievement" (
	"createdAt",
	"updatedAt",
	"name",
	"description",
	"picture"
)
VALUES (
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP,
	'Achievement 01',
	'description achievement 01',
	'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f0d20aed-7894-4806-9a4d-a75e09a21479/dfisg7r-2756622e-d363-48e9-b4b3-60fbae5f3fc1.jpg/v1/fit/w_828,h_1210,q_70,strp/cat_portrait_by_elit3workshop_dfisg7r-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTg3MSIsInBhdGgiOiJcL2ZcL2YwZDIwYWVkLTc4OTQtNDgwNi05YTRkLWE3NWUwOWEyMTQ3OVwvZGZpc2c3ci0yNzU2NjIyZS1kMzYzLTQ4ZTktYjRiMy02MGZiYWU1ZjNmYzEuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.jL8vZxwD_zgQH61cLswwZFt5zD8J4piwkN2S99FUsew'
)
ON CONFLICT DO NOTHING;

INSERT INTO "Achievement" (
	"createdAt",
	"updatedAt",
	"name",
	"description",
	"picture"
)
VALUES (
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP,
	'Achievement 02',
	'description achievement 02',
	'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9afd00a5-aedc-4738-8bad-aedbc4347035/dfm6xoc-f6d87e9a-c2c3-429a-86b0-af14471e1152.png/v1/fill/w_894,h_894,q_70,strp/adventurous_cat_on_a_mountain_by_eleazatlr_dfm6xoc-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAyNCIsInBhdGgiOiJcL2ZcLzlhZmQwMGE1LWFlZGMtNDczOC04YmFkLWFlZGJjNDM0NzAzNVwvZGZtNnhvYy1mNmQ4N2U5YS1jMmMzLTQyOWEtODZiMC1hZjE0NDcxZTExNTIucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.KybEBNPfzr4bDqNa4i3NdrIBZvibplVgp1YuryCtChU'
)
ON CONFLICT DO NOTHING;

INSERT INTO "Achievement" (
	"createdAt",
	"updatedAt",
	"name",
	"description",
	"picture"
)
VALUES (
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP,
	'Achievement 03',
	'description achievement 03',
	'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/41a90494-10c5-4ce6-87bd-ec59c553f6fb/d7kqif4-2e3a7da7-5b3c-41d6-a087-e18b5f463b5c.jpg/v1/fill/w_893,h_894,q_70,strp/helghast_cat_2_by_easycheuvreuille_d7kqif4-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAyNSIsInBhdGgiOiJcL2ZcLzQxYTkwNDk0LTEwYzUtNGNlNi04N2JkLWVjNTljNTUzZjZmYlwvZDdrcWlmNC0yZTNhN2RhNy01YjNjLTQxZDYtYTA4Ny1lMThiNWY0NjNiNWMuanBnIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.mo0iubDEvALRjHSKdzBQpgGXpbOxeUOZ074sgGBfa0M'
)
ON CONFLICT DO NOTHING;

INSERT INTO "Achievement" (
	"createdAt",
	"updatedAt",
	"name",
	"description",
	"picture"
)
VALUES (
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP,
	'Achievement 04',
	'description achievement 04',
	'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/638b9feb-cb46-4dd9-abee-03af5c0f7768/dfnr4sy-6c76516c-cf2f-4647-9d22-1ae41713641b.png/v1/fit/w_600,h_600,q_70,strp/art_deco_cat_by_aleyarts_dfnr4sy-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzYzOGI5ZmViLWNiNDYtNGRkOS1hYmVlLTAzYWY1YzBmNzc2OFwvZGZucjRzeS02Yzc2NTE2Yy1jZjJmLTQ2NDctOWQyMi0xYWU0MTcxMzY0MWIucG5nIiwiaGVpZ2h0IjoiPD02MDAiLCJ3aWR0aCI6Ijw9NjAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLndhdGVybWFyayJdLCJ3bWsiOnsicGF0aCI6Ilwvd21cLzYzOGI5ZmViLWNiNDYtNGRkOS1hYmVlLTAzYWY1YzBmNzc2OFwvYWxleWFydHMtNC5wbmciLCJvcGFjaXR5Ijo5NSwicHJvcG9ydGlvbnMiOjAuNDUsImdyYXZpdHkiOiJjZW50ZXIifX0.PpFwlZEmx8lYkrzsXOzMbcO4ZcOSjZd41EzrCWUghqg'
)
ON CONFLICT DO NOTHING;

INSERT INTO "Achievement" (
	"createdAt",
	"updatedAt",
	"name",
	"description",
	"picture"
)
VALUES (
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP,
	'Achievement 05',
	'description achievement 05',
	'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6785f2e3-0b22-4d78-b310-d370ff56de42/dfs4sg1-558c6e14-5037-4c93-96af-97da4c785899.png/v1/fill/w_894,h_894/psychedelic_cat_by_microdosediffusion_dfs4sg1-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA3NSIsInBhdGgiOiJcL2ZcLzY3ODVmMmUzLTBiMjItNGQ3OC1iMzEwLWQzNzBmZjU2ZGU0MlwvZGZzNHNnMS01NThjNmUxNC01MDM3LTRjOTMtOTZhZi05N2RhNGM3ODU4OTkucG5nIiwid2lkdGgiOiI8PTEwNzUifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.ZmHc8WsjzD7ntrp9ME8eAYANFVb-y-DZRC0oqtbMSeU'
)
ON CONFLICT DO NOTHING;

--- Inserting Achieved
INSERT INTO "Achieved" (
	"playerID",
	"achievementName",
	"date_of_issue"
)
VALUES (
	'101282',
	'Achievement 01',
	CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO "Achieved" (
	"playerID",
	"achievementName",
	"date_of_issue"
)
VALUES (
	'101282',
	'Achievement 02',
	CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO "Achieved" (
	"playerID",
	"achievementName",
	"date_of_issue"
)
VALUES (
	'101282',
	'Achievement 03',
	CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO "Achieved" (
	"playerID",
	"achievementName",
	"date_of_issue"
)
VALUES (
	'101282',
	'Achievement 04',
	CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO "Achieved" (
	"playerID",
	"achievementName",
	"date_of_issue"
)
VALUES (
	'101282',
	'Achievement 05',
	CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO "Achieved" (
	"playerID",
	"achievementName",
	"date_of_issue"
)
VALUES (
	'1',
	'Achievement 01',
	CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO "Achieved" (
	"playerID",
	"achievementName",
	"date_of_issue"
)
VALUES (
	'2',
	'Achievement 02',
	CURRENT_TIMESTAMP
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
	101282,
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
	false,
	true,
	false,
	false,
	2,
	101282
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
	101282,
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
	101282,
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
	101282
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
	101282
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
	101282,
	3
)
ON CONFLICT DO NOTHING;
