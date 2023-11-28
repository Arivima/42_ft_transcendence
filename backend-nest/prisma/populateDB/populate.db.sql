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
	1111,
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
	2222,
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
	3333,
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
	99696,
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
	'promising kitty',
	'You have won one game, congratulations!',
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
	'Now feed me some good tuna!',
	'You have won two games, congratulations!',
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
	'I need no Catnip to win!',
	'You have won five games, congratulations!',
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
	'Your Catventure begins here!',
	'You successfully created a profile @ cazzendence!',
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
	'Chi trova un amico, trova un tesoro',
	'You just added a new friend!',
	'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6785f2e3-0b22-4d78-b310-d370ff56de42/dfs4sg1-558c6e14-5037-4c93-96af-97da4c785899.png/v1/fill/w_894,h_894/psychedelic_cat_by_microdosediffusion_dfs4sg1-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA3NSIsInBhdGgiOiJcL2ZcLzY3ODVmMmUzLTBiMjItNGQ3OC1iMzEwLWQzNzBmZjU2ZGU0MlwvZGZzNHNnMS01NThjNmUxNC01MDM3LTRjOTMtOTZhZi05N2RhNGM3ODU4OTkucG5nIiwid2lkdGgiOiI8PTEwNzUifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.ZmHc8WsjzD7ntrp9ME8eAYANFVb-y-DZRC0oqtbMSeU'
)
ON CONFLICT DO NOTHING;

--- Inserting Achieved
-- INSERT INTO "Achieved" (
-- 	"playerID",
-- 	"achievementName",
-- 	"date_of_issue"
-- )
-- VALUES (
-- 	'99696',
-- 	'Achievement 01',
-- 	CURRENT_TIMESTAMP
-- )
-- ON CONFLICT DO NOTHING;

-- INSERT INTO "Achieved" (
-- 	"playerID",
-- 	"achievementName",
-- 	"date_of_issue"
-- )
-- VALUES (
-- 	'99696',
-- 	'Achievement 02',
-- 	CURRENT_TIMESTAMP
-- )
-- ON CONFLICT DO NOTHING;

-- INSERT INTO "Achieved" (
-- 	"playerID",
-- 	"achievementName",
-- 	"date_of_issue"
-- )
-- VALUES (
-- 	'99696',
-- 	'Achievement 03',
-- 	CURRENT_TIMESTAMP
-- )
-- ON CONFLICT DO NOTHING;

-- INSERT INTO "Achieved" (
-- 	"playerID",
-- 	"achievementName",
-- 	"date_of_issue"
-- )
-- VALUES (
-- 	'99696',
-- 	'Achievement 04',
-- 	CURRENT_TIMESTAMP
-- )
-- ON CONFLICT DO NOTHING;

-- INSERT INTO "Achieved" (
-- 	"playerID",
-- 	"achievementName",
-- 	"date_of_issue"
-- )
-- VALUES (
-- 	'99696',
-- 	'Achievement 05',
-- 	CURRENT_TIMESTAMP
-- )
-- ON CONFLICT DO NOTHING;

-- INSERT INTO "Achieved" (
-- 	"playerID",
-- 	"achievementName",
-- 	"date_of_issue"
-- )
-- VALUES (
-- 	'1',
-- 	'Achievement 01',
-- 	CURRENT_TIMESTAMP
-- )
-- ON CONFLICT DO NOTHING;

-- INSERT INTO "Achieved" (
-- 	"playerID",
-- 	"achievementName",
-- 	"date_of_issue"
-- )
-- VALUES (
-- 	'2',
-- 	'Achievement 02',
-- 	CURRENT_TIMESTAMP
-- )
-- ON CONFLICT DO NOTHING;


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
	false,
	true,
	false,
	false,
	2,
	99696
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
	"hostID",
	"guestID"
)
VALUES (
	CURRENT_TIMESTAMP,
	6,
	1,
	99696,
	1
)
ON CONFLICT DO NOTHING;

INSERT INTO "Plays" (
	"createdAt",
	"score_host",
	"score_Guest",
	"hostID",
	"guestID"
)
VALUES (
	CURRENT_TIMESTAMP,
	4,
	0,
	2,
	99696
)
ON CONFLICT DO NOTHING;

INSERT INTO "Plays" (
	"createdAt",
	"score_host",
	"score_Guest",
	"hostID",
	"guestID"
)
VALUES (
	CURRENT_TIMESTAMP,
	4,
	5,
	3,
	99696
)
ON CONFLICT DO NOTHING;

INSERT INTO "Plays" (
	"createdAt",
	"score_host",
	"score_Guest",
	"hostID",
	"guestID"
)
VALUES (
	CURRENT_TIMESTAMP,
	4,
	6,
	99696,
	3
)
ON CONFLICT DO NOTHING;
