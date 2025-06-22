import { integer, pgTable, varchar, text, pgEnum, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define enums to match the database
const userRoleEnum = pgEnum('user_role_enum', ['employee', 'verifier', 'approver1', 'approver2']);
const permissionEnum = pgEnum('permission_enum', [
  'view_dashboard',
  'create_post',
  'edit_post',
  'delete_post',
  'verify_content',
  'approve_content',
  'manage_users',
  'reverse_claim'  // Allow sending claims back to employees
]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  last_login: timestamp('last_login').defaultNow().notNull()
});

export const user_roles = pgTable("user_roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.user_id, { onDelete: "cascade" }),
  role: userRoleEnum('role').notNull()
});

export const role_permissions = pgTable("role_permissions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  role: userRoleEnum('role').notNull(),
  permission: permissionEnum('permission').notNull()
});

// Export types
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type UserRole = typeof user_roles.$inferSelect;
export type NewUserRole = typeof user_roles.$inferInsert;
export type RolePermission = typeof role_permissions.$inferSelect;
export type NewRolePermission = typeof role_permissions.$inferInsert;

// Claim Status Enum
export const claimStatusEnum = pgEnum('claim_status', [
  'draft',      // Created by employee, can be edited
  'submitted',  // Submitted by employee, waiting for verifier
  'reviewed',   // Reviewed by verifier
  'reversed',   // Sent back to employee
  'approved',   // Final approval
  'rejected',   // Final rejection
  'waitlisted'  // Put on hold by approver
]);

export const claims = pgTable("claims", {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.user_id, { onDelete: 'cascade' }),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  amount: integer().notNull(),
  status: claimStatusEnum('status').default('draft').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  submitted_at: timestamp('submitted_at'),
  reviewed_at: timestamp('reviewed_at'),
  resolved_at: timestamp('resolved_at'),
  resolved_by: varchar({ length: 255 })
    .references(() => usersTable.user_id, { onDelete: 'set null' }),
  rejection_reason: text(),
  waitlist_reason: text(),
});

// Relations
export const claimsRelations = relations(claims, ({ one }) => ({
  user: one(usersTable, {
    fields: [claims.user_id],
    references: [usersTable.user_id],
  }),
  resolvedBy: one(usersTable, {
    fields: [claims.resolved_by],
    references: [usersTable.user_id],
    relationName: 'resolved_by_user'
  }),
}));

// claim Attachments
export const claimAttachments = pgTable("claim_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  claim_id: uuid("claim_id").notNull().references(()=>claims.id, {onDelete: "cascade"}),
  file_name: varchar({length: 255}).notNull(),
  file_type: varchar({length: 100}).notNull(),
  file_size: integer().notNull(),
  file_path: varchar({length: 255}).notNull(),
  uploaded_at: timestamp('uploaded_at').defaultNow().notNull(),
})

// Types
export type Claim = typeof claims.$inferSelect;
export type NewClaim = typeof claims.$inferInsert;
export type ClaimStatus = typeof claimStatusEnum.enumValues[number];
export type ClaimAttachment = typeof claimAttachments.$inferSelect;

