/*
  Warnings:

  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tier` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `purchasedAt` on the `UserPet` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Plan";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT,
    "title" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT NOT NULL DEFAULT 'slate',
    "isHabit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("color", "createdAt", "date", "done", "id", "time", "title", "userId") SELECT "color", "createdAt", "date", "done", "id", "time", "title", "userId" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'inactive',
    "activePetId" TEXT,
    "profileTheme" TEXT NOT NULL DEFAULT 'forest',
    "profileBio" TEXT,
    "totalTasksDone" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "amazingMoodDays" INTEGER NOT NULL DEFAULT 0,
    "lastCheckInDate" TEXT,
    "lastLat" REAL,
    "lastLng" REAL,
    "lastCity" TEXT,
    "locationUpdatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("activePetId", "createdAt", "email", "id", "lastCity", "lastLat", "lastLng", "locationUpdatedAt", "name", "password", "profileBio", "profileTheme", "stripeCustomerId", "stripeSubscriptionId", "subscriptionStatus") SELECT "activePetId", "createdAt", "email", "id", "lastCity", "lastLat", "lastLng", "locationUpdatedAt", "name", "password", "profileBio", "profileTheme", "stripeCustomerId", "stripeSubscriptionId", "subscriptionStatus" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_UserPet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserPet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserPet" ("id", "petId", "userId") SELECT "id", "petId", "userId" FROM "UserPet";
DROP TABLE "UserPet";
ALTER TABLE "new_UserPet" RENAME TO "UserPet";
CREATE UNIQUE INDEX "UserPet_userId_petId_key" ON "UserPet"("userId", "petId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
