# Rating Site

Ability to rate different activities. This project is meant to be used by orgs. For example if an amusement park uses it each ride would be a different activity.

This is still a work in progress and is not fully functional. Nothing with admins is working (or made) and only the basic user end UI and functionality is done. I still need to show average acitvity ratings and allow users to edit and delete their ratings. In addition I need to add the ability for users to be able to edit their accounts (usernames, passwords, etc)

You can test it at https://rating-site-rho.vercel.app/

## Dev

Libraries/Frameworks used:
- Nextjs
- HeroUI
- Better Auth
- pg
- postgres

### SQL Tables

SQL statments needed to create the custom tables

```sql
CREATE TABLE "ratings" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ratings_id_seq"),
  "activity" integer NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "rating" integer NOT NULL,
  "userid" text NOT NULL
);

CREATE TABLE "activities" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "activities_id_seq"),
  "name" text NOT NULL,
  "description" text NOT NULL,
  "userid" text NOT NULL
);
```
