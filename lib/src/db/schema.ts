import { integer, pgTable, varchar, text, pgEnum, timestamp } from "drizzle-orm/pg-core";

// Define enums to match the database
const userRoleEnum = pgEnum('user_role_enum', ['employee', 'verifier', 'approver1', 'approver2']);
const permissionEnum = pgEnum('permission_enum', [
  'view_dashboard',
  'create_post',
  'edit_post',
  'delete_post',
  'verify_content',
  'approve_content',
  'manage_users'
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