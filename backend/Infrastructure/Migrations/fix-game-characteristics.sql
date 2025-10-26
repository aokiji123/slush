-- Fix GameCharacteristics table for multi-platform support

-- Step 1: Check if Id column exists, if not, add it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'GameCharacteristics' 
                   AND column_name = 'Id') THEN
        ALTER TABLE "GameCharacteristics" ADD COLUMN "Id" UUID;
        UPDATE "GameCharacteristics" SET "Id" = gen_random_uuid();
        ALTER TABLE "GameCharacteristics" ALTER COLUMN "Id" SET NOT NULL;
    END IF;
END $$;

-- Step 2: Add CreatedAt and UpdatedAt columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'GameCharacteristics' 
                   AND column_name = 'CreatedAt') THEN
        ALTER TABLE "GameCharacteristics" ADD COLUMN "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'GameCharacteristics' 
                   AND column_name = 'UpdatedAt') THEN
        ALTER TABLE "GameCharacteristics" ADD COLUMN "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW();
    END IF;
END $$;

-- Step 3: Drop PK constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'PK_GameCharacteristics') THEN
        ALTER TABLE "GameCharacteristics" DROP CONSTRAINT "PK_GameCharacteristics";
    END IF;
END $$;

-- Step 4: Add new PK on Id
ALTER TABLE "GameCharacteristics" ADD CONSTRAINT "PK_GameCharacteristics" PRIMARY KEY ("Id");

-- Step 5: Create indexes
CREATE INDEX IF NOT EXISTS "IX_GameCharacteristics_GameId" ON "GameCharacteristics" ("GameId");

CREATE UNIQUE INDEX IF NOT EXISTS "IX_GameCharacteristics_GameId_Platform" 
ON "GameCharacteristics" ("GameId", "Platform");

