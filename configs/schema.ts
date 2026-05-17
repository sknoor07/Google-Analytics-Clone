import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const websiteTable = pgTable("websites", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    websiteId: varchar({ length: 255 }).notNull().unique(),
    domain: varchar({ length: 255 }).notNull().unique(),
    timezone: varchar({ length: 255 }).notNull(),
    enableLocalhostTracking: boolean().default(false),
    userEmail:varchar({ length: 255 }).notNull(),
});

export const pageViewTable= pgTable("pageViews",{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    visitorId:varchar({length:255}),
    websiteId:varchar({ length: 255 }).notNull(),
    domain:varchar({length:255}).notNull(),
    type:varchar({ length: 50 }).notNull(),
    entryTime:varchar({length:100}),
    exitTime:varchar({length:100}),
    totalActiveTime:integer(),
    referrer:varchar({ length: 2048 }),
    url:varchar({ length: 2048 }),
    urlParams:varchar({length:500}),
    utmsource:varchar({length:100}),
    utmMedium:varchar({length:100}),
    utmCampaign:varchar({length:100}),
    refParams:varchar({length:100}),
    device:varchar({length:50}),
    cpu:varchar({length:50}),
    os:varchar({length:50}),
    browser:varchar({length:50}),
    ip:varchar({length:50}),
    city:varchar({length:50}),
    region:varchar({length:50}),
    country:varchar({length:50}),
});