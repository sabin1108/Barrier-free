import { sql } from "drizzle-orm";
import { boolean, index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const genRandomUuid = sql`gen_random_uuid()::text`;

export const users = pgTable("users", {
  id: text("id").primaryKey().default(genRandomUuid),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  raw_json: jsonb("raw_json"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
});

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey().default(genRandomUuid),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    image_url: text("image_url"),
    github_url: text("github_url"),
    live_url: text("live_url"),
    tags: text("tags").array().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_projects_user_id").on(table.user_id),
    featuredIdx: index("idx_projects_featured").on(table.featured),
    tagsIdx: index("idx_projects_tags").using("gin", table.tags),
  }),
);

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey().default(genRandomUuid),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  headline: text("headline").notNull(),
  bio: text("bio").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const techStacks = pgTable("tech_stacks", {
  id: text("id").primaryKey().default(genRandomUuid),
  name: text("name").notNull().unique(),
  aliases: text("aliases").array().notNull().default([]),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
