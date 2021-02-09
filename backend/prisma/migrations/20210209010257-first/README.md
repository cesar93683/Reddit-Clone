# Migration `20210209010257-first`

This migration has been generated at 2/8/2021, 5:02:57 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "Post" (
"id" SERIAL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "numComments" INTEGER NOT NULL,
    "numVotes" INTEGER NOT NULL,
    "dateCreated" TEXT NOT NULL,
    "dateUpdated" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "PostVote" (
"id" SERIAL,
    "value" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "commentId" INTEGER,

    PRIMARY KEY ("id")
)

CREATE TABLE "CommentVote" (
"id" SERIAL,
    "value" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Comment" (
"id" SERIAL,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "numVotes" INTEGER NOT NULL,
    "dateCreated" TEXT NOT NULL,
    "dateUpdated" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "User" (
"id" SERIAL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "User"("email")

CREATE UNIQUE INDEX "User.username_unique" ON "User"("username")

ALTER TABLE "Post" ADD FOREIGN KEY("authorId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "PostVote" ADD FOREIGN KEY("authorId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "PostVote" ADD FOREIGN KEY("postId")REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "PostVote" ADD FOREIGN KEY("commentId")REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "CommentVote" ADD FOREIGN KEY("authorId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "CommentVote" ADD FOREIGN KEY("commentId")REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Comment" ADD FOREIGN KEY("authorId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Comment" ADD FOREIGN KEY("postId")REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20210209010257-first
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,65 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgres"
+  url = "***"
+}
+
+model Post {
+  id          Int       @default(autoincrement()) @id
+  title       String
+  content     String
+  author      User      @relation(fields: [authorId], references: [id])
+  authorId    Int
+  comments    Comment[]
+  numComments Int
+  votes       PostVote[]
+  numVotes    Int
+  dateCreated String
+  dateUpdated String
+}
+
+model PostVote {
+  id          Int       @default(autoincrement()) @id
+  value       Int
+  author      User      @relation(fields: [authorId], references: [id])
+  authorId    Int
+  post        Post      @relation(fields: [postId], references: [id])
+  postId      Int
+}
+
+
+model CommentVote {
+  id          Int       @default(autoincrement()) @id
+  value       Int
+  author      User      @relation(fields: [authorId], references: [id])
+  authorId    Int
+  comment     Comment   @relation(fields: [commentId], references: [id])
+  commentId   Int
+}
+
+model Comment {
+  id          Int       @default(autoincrement()) @id
+  content     String
+  author      User      @relation(fields: [authorId], references: [id])
+  authorId    Int
+  post        Post      @relation(fields: [postId], references: [id])
+  postId      Int
+  votes       PostVote[]
+  numVotes    Int
+  dateCreated String
+  dateUpdated String
+}
+
+model User {
+  id           Int       @default(autoincrement()) @id
+  email        String    @unique
+  password     String
+  username     String    @unique
+  posts        Post[]
+  comments     Comment[]
+  postVotes    PostVote[]
+  commentVotes CommentVote[]
+}
```


