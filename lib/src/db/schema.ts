import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";   
 
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    // user unique id from auth
    user_id: varchar({ length: 255 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
  });

const ROLES = ["employee", "verifier", "approver1", "approver2"] as const;
const PERMISSIONS = ["create", "read", "update", "delete"] as const;

export const user_roles = pgTable("user_roles", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: varchar({ length: 255 }).notNull().references(() => usersTable.user_id, { onDelete: "cascade" }),
    role:text({enum: ROLES}).notNull()
})
export const rolePermissions = pgTable("role_permissions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  role: text({ enum: ROLES }).notNull(),
  permission: text({ enum: PERMISSIONS }).notNull()
});