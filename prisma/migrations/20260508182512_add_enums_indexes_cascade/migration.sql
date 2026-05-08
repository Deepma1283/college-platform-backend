-- CreateEnum
CREATE TYPE "college_type" AS ENUM ('GOVERNMENT', 'PRIVATE', 'DEEMED', 'AUTONOMOUS');

-- CreateEnum
CREATE TYPE "course_category" AS ENUM ('ENGINEERING', 'MEDICAL', 'MANAGEMENT', 'LAW', 'ARTS', 'SCIENCE', 'COMMERCE', 'DESIGN', 'OTHER');

-- CreateEnum
CREATE TYPE "exam_type" AS ENUM ('JEE_MAIN', 'JEE_ADVANCED', 'NEET', 'CAT', 'GATE');

-- CreateTable
CREATE TABLE "colleges" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "fees" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "placementPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgPackage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "highestPackage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "established" INTEGER NOT NULL,
    "affiliation" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "college_type" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colleges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "fees" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL,
    "category" "course_category" NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "content" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictor_rules" (
    "id" SERIAL NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "exam" "exam_type" NOT NULL,
    "branch" TEXT NOT NULL,
    "rankMin" INTEGER NOT NULL,
    "rankMax" INTEGER NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 2023,

    CONSTRAINT "predictor_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "colleges_slug_key" ON "colleges"("slug");

-- CreateIndex
CREATE INDEX "colleges_state_city_idx" ON "colleges"("state", "city");

-- CreateIndex
CREATE INDEX "colleges_fees_rating_idx" ON "colleges"("fees", "rating");

-- CreateIndex
CREATE INDEX "colleges_type_rating_idx" ON "colleges"("type", "rating");

-- CreateIndex
CREATE INDEX "courses_collegeId_idx" ON "courses"("collegeId");

-- CreateIndex
CREATE INDEX "courses_category_fees_idx" ON "courses"("category", "fees");

-- CreateIndex
CREATE INDEX "reviews_collegeId_createdAt_idx" ON "reviews"("collegeId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "predictor_rules_exam_rankMin_rankMax_idx" ON "predictor_rules"("exam", "rankMin", "rankMax");

-- CreateIndex
CREATE INDEX "predictor_rules_collegeId_exam_idx" ON "predictor_rules"("collegeId", "exam");

-- CreateIndex
CREATE UNIQUE INDEX "predictor_rules_collegeId_exam_branch_year_key" ON "predictor_rules"("collegeId", "exam", "branch", "year");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictor_rules" ADD CONSTRAINT "predictor_rules_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
