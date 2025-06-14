import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";   
 
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    // user unique id from auth
    user_id: varchar({ length: 255 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: text({enum: ["employee", "verifier", "approver1", "approver2"]}).notNull()
  });