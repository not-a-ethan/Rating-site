# Rating Site

Ability to rate diffrent activities

## Dev

### SQL Tables

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