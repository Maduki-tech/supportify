// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `supportify_${name}`);

export const users = createTable(
    "user",
    (d) => ({
        id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
        clearkID: d.varchar({ length: 256 }).notNull(),
    })
)

export const organization = createTable(
    "organization",
    (d) => ({
        id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
        name: d.varchar({ length: 256 }).notNull(),
        createdAt: d.timestamp({ withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
        deletedAt: d.timestamp({ withTimezone: true }),

    })
)

export const projects = createTable(
    "project",
    (d) => ({
        id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
        name: d.varchar({ length: 256 }).notNull(),
        organizationID: d.integer().references(() => organization.id).notNull(),
        createdAt: d.timestamp({ withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
        deletedAt: d.timestamp({ withTimezone: true }),
    })
)

export const organizationRelation = relations(organization, ({ many }) => ({
    projects: many(projects),
}))

export const projectRelation = relations(projects, ({ one }) => ({
    organization: one(organization, {
        fields: [projects.organizationID],
        references: [organization.id],
    }),
}))
