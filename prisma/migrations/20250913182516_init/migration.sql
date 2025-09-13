-- CreateTable
CREATE TABLE "public"."SharedResult" (
    "id" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "results" JSONB NOT NULL,
    "aiStory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SavedScenario" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "results" JSONB NOT NULL,
    "aiStory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedScenario_pkey" PRIMARY KEY ("id")
);
