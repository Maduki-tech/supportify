import { relations } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `supportify_${name}`);
// TODO: Maybe change id with uuid some day

export const users = createTable(
    "user",
    (d) => ({
        id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
        clerkID: d.varchar({ length: 256 }).notNull(),
        orgID: d.integer().references(() => organization.id).notNull(),
        createdAt: d.timestamp({ withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
        deletedAt: d.timestamp({ withTimezone: true }),
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

export const tickets = createTable(
    "ticket",
    (d) => ({
        id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
        title: d.varchar({ length: 256 }).notNull(),
        description: d.text().notNull(),
        projectID: d.integer().references(() => projects.id).notNull(),
        assigneeID: d.integer().references(() => users.id),
        createdAt: d.timestamp({ withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
        deletedAt: d.timestamp({ withTimezone: true }),
    })
)

export const organizationRelation = relations(organization, ({ many }) => ({
    projects: many(projects),
    users: many(users),
}))

export const projectRelation = relations(projects, ({ one }) => ({
    organization: one(organization, {
        fields: [projects.organizationID],
        references: [organization.id],
    }),
}))

export const ticketRelation = relations(tickets, ({ one }) => ({
    project: one(projects, {
        fields: [tickets.projectID],
        references: [projects.id],
    }),
    assignee: one(users, {
        fields: [tickets.assigneeID],
        references: [users.id],
    }),
}))

export const userRelation = relations(users, ({ one }) => ({
    organization: one(organization, {
        fields: [users.orgID],
        references: [organization.id],
    }),
}))

