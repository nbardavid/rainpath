-- Add unique constraint on case identifier
ALTER TABLE "Case"
ADD CONSTRAINT "Case_identifier_key" UNIQUE ("identifier");

-- Drop identifier columns from nested entities
ALTER TABLE "Specimen"
DROP COLUMN IF EXISTS "identifier";

ALTER TABLE "Block"
DROP COLUMN IF EXISTS "identifier";

ALTER TABLE "Slide"
DROP COLUMN IF EXISTS "identifier";
