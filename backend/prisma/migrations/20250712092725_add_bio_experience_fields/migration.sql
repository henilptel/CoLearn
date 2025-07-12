-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "experience_years" INTEGER NOT NULL DEFAULT 0;
