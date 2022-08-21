CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "avatar" varchar NOT NULL DEFAULT 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png',
  "name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "role" varchar NOT NULL DEFAULT 'user'
);

CREATE TABLE "fundraisers" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigserial NOT NULL,
  "phone" varchar UNIQUE NOT NULL,
  "address" varchar NOT NULL,
  "description" varchar NOT NULL,
  "is_active" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "campaigns" (
  "id" bigserial PRIMARY KEY,
  "fundraiser_id" bigserial NOT NULL,
  "type_id" bigserial NOT NULL,
  "title" varchar UNIQUE NOT NULL,
  "description" varchar NOT NULL,
  "image" varchar NOT NULL,
  "collected_amount" decimal NOT NULL DEFAULT 0,
  "target_amount" decimal NOT NULL,
  "withdrawn_amount" decimal NOT NULL DEFAULT 0,
  "slug" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "donations" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigserial NOT NULL,
  "campaign_id" bigserial NOT NULL,
  "amount" decimal NOT NULL,
  "words" varchar NOT NULL,
  "is_anonymous" boolean NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "withdrawn" (
  "id" bigserial PRIMARY KEY,
  "campaign_id" bigserial NOT NULL,
  "amount" decimal NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "types" (
  "id" bigserial PRIMARY KEY,
  "title" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE INDEX ON "users" ("name");

CREATE INDEX ON "campaigns" ("title");

ALTER TABLE "fundraisers" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "campaigns" ADD FOREIGN KEY ("fundraiser_id") REFERENCES "fundraisers" ("id");

ALTER TABLE "campaigns" ADD FOREIGN KEY ("type_id") REFERENCES "types" ("id");

ALTER TABLE "donations" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "donations" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id");

ALTER TABLE "withdrawn" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id");