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
	'https://www.eltekitalia.it/portal/wp-content/uploads/2023/12/cat_portrait_by_elit3workshop_dfisg7r-414w-2x.jpg'
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
	'https://www.eltekitalia.it/portal/wp-content/uploads/2023/12/adventurous_cat_on_a_mountain_by_eleazatlr_dfm6xoc-pre.jpg'
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
	'https://www.eltekitalia.it/portal/wp-content/uploads/2023/12/helghast_cat_2_by_easycheuvreuille_d7kqif4-pre.jpg'
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
	'https://www.eltekitalia.it/portal/wp-content/uploads/2023/12/art_deco_cat_by_aleyarts_dfnr4sy-375w-2x.jpg'
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
	'https://www.eltekitalia.it/portal/wp-content/uploads/2023/12/psychedelic_cat_by_microdosediffusion_dfs4sg1-pre.png'
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
	1111
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
	2222,
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
	3333
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
	1111
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
	2222,
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
	3333,
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
	3333
)
ON CONFLICT DO NOTHING;
