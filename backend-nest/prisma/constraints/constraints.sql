
-- a group may be a dm or a group message, but not both
ALTER TABLE "Message"
ADD CONSTRAINT recipients_check
CHECK (
	("receiverID" IS NULL AND "receiverSID" IS NOT NULL) OR
	("receiverSID" IS NULL AND "receiverID" IS NOT NULL)
);

-- uniqueness on composite key of BeFriends table, regardless of ordering
CREATE OR REPLACE FUNCTION befriends_check_order_uniqueness()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "BeFriends"
        WHERE (NEW."requestorID" = "recipientID" AND NEW."recipientID" = "requestorID")
    ) THEN
        RAISE EXCEPTION 'Duplicate entry with different order of requestorID and requestorID';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER befriends_check_order_uniqueness_trigger
BEFORE INSERT ON "BeFriends"
FOR EACH ROW
EXECUTE FUNCTION befriends_check_order_uniqueness();
