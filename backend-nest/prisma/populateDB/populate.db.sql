
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
