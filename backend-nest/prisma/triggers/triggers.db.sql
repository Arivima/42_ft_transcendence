CREATE OR REPLACE FUNCTION update_players_stats()
RETURNS TRIGGER AS $$
DECLARE
	"winnerID" int;
	"loserID" int;
	"winnerWins" int;
	"winnerLosses" int;
	"loserWins" int;
	"loserLosses" int;
	"winnerGames" int;
	"loserGames" int;
BEGIN
	IF  NEW."score_host" > NEW."score_Guest" THEN
		"winnerID" := NEW."hostID";
		"loserID" := NEW."guestID";
	ELSE
		"winnerID" := NEW."guestID";
		"loserID" := NEW."hostID";
	END IF;

	SELECT "wins"
	INTO "winnerWins"
	FROM "Player"
	WHERE "id" = "winnerID";
	SELECT "losses"
	INTO "winnerLosses"
	FROM "Player"
	WHERE "id" = "winnerID";

	SELECT "wins"
	INTO "loserWins"
	FROM "Player"
	WHERE "id" = "loserID";
	SELECT "losses"
	INTO "loserLosses"
	FROM "Player"
	WHERE "id" = "loserID";

	SELECT COUNT(*)
	INTO "winnerGames"
	FROM "Plays"
	WHERE "hostID" = "winnerID" OR "guestID" = "winnerID";
	
	SELECT COUNT(*)
	INTO "loserGames"
	FROM "Plays"
	WHERE "hostID" = "loserID" OR "guestID" = "loserID";

	-- updating player table
	UPDATE "Player"
	SET "wins" = "wins" + 1, "ladder_lvl" = ROUND(
		("winnerGames" + 1)*(("winnerWins" + 1)::numeric/("winnerLosses" + 1))::numeric
	)
	WHERE "id" = "winnerID";
	
	UPDATE "Player"
	SET "losses" = "losses" + 1, "ladder_lvl" = ROUND(
		("loserGames" + 1)*(("loserWins")::numeric/("loserLosses" + 1 + 1))::numeric
	)
	WHERE "id" = "loserID";

	RETURN NEW;

END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_achievements_trigger ON "Plays";

CREATE TRIGGER update_achievements_trigger
BEFORE INSERT ON "Plays"
FOR EACH ROW
EXECUTE FUNCTION update_players_stats();

