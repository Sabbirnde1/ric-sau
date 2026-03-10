-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "image" TEXT,
    "readTime" TEXT NOT NULL DEFAULT '3 min read',
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lead" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "budget" REAL NOT NULL,
    "team" TEXT,
    "technologies" TEXT,
    "publications" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "image" TEXT,
    "specializations" TEXT,
    "publications" INTEGER NOT NULL DEFAULT 0,
    "projects" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Innovator" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "image" TEXT,
    "achievements" TEXT NOT NULL DEFAULT '',
    "ripd" TEXT NOT NULL DEFAULT '',
    "pi" TEXT NOT NULL DEFAULT '',
    "coPi" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RlCommittee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "About" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mission" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "established" TEXT NOT NULL,
    "image" TEXT,
    "achievements" TEXT,
    "heroTitle" TEXT NOT NULL DEFAULT 'Research & Innovation Center (RIC - SAU)',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Fostering innovation, entrepreneurship, and agricultural technology for a sustainable future.',
    "heroImage" TEXT,
    "identity" TEXT NOT NULL DEFAULT '',
    "funding" TEXT NOT NULL DEFAULT '[]',
    "fundingImage" TEXT,
    "whoCanApply" TEXT NOT NULL DEFAULT '[]',
    "whatYouGet" TEXT NOT NULL DEFAULT '[]',
    "focusAreas" TEXT NOT NULL DEFAULT '[]',
    "howToApply" TEXT NOT NULL DEFAULT '[]',
    "applyEmail" TEXT NOT NULL DEFAULT 'info.sauric@gmail.com',
    "ctaTitle" TEXT NOT NULL DEFAULT 'Innovate. Collaborate. Transform Agriculture.',
    "ctaSubtitle" TEXT NOT NULL DEFAULT 'Join RIC–SAU to redefine agricultural innovation for a digital Bangladesh.',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "officeHours" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Home" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hero" TEXT NOT NULL,
    "stats" TEXT NOT NULL,
    "features" TEXT NOT NULL DEFAULT '[]',
    "cta" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "journal" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Journal Article',
    "citations" INTEGER NOT NULL DEFAULT 0,
    "abstract" TEXT NOT NULL,
    "doi" TEXT NOT NULL DEFAULT '',
    "keywords" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lab" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "established" INTEGER NOT NULL,
    "members" INTEGER NOT NULL DEFAULT 0,
    "focus" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "projects" INTEGER NOT NULL DEFAULT 0,
    "publications" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "general" TEXT NOT NULL,
    "seo" TEXT NOT NULL,
    "social" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
