/*
  Warnings:

  - You are about to drop the column `hasDog` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hasMap` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "UserPet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "purchasedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserPet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'inactive',
    "tier" TEXT NOT NULL DEFAULT 'free',
    "avatar" TEXT,
    "activePetId" TEXT,
    "profileTheme" TEXT NOT NULL DEFAULT 'default',
    "profileBio" TEXT,
    "lastLat" REAL,
    "lastLng" REAL,
    "lastCity" TEXT,
    "locationUpdatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("avatar", "createdAt", "email", "id", "lastCity", "lastLat", "lastLng", "locationUpdatedAt", "name", "password", "stripeCustomerId", "stripeSubscriptionId", "subscriptionStatus", "tier") SELECT "avatar", "createdAt", "email", "id", "lastCity", "lastLat", "lastLng", "locationUpdatedAt", "name", "password", "stripeCustomerId", "stripeSubscriptionId", "subscriptionStatus", "tier" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserPet_userId_petId_key" ON "UserPet"("userId", "petId");
