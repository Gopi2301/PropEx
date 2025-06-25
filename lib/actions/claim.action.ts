import { createClient } from "@/utils/supabase/server"
import { claims, usersTable } from "../src/db/schema"
import db from "../src"
import { eq } from "drizzle-orm";
// employee 
export const fetchClaimById = async (id: string) => {
    console.log("id", id)
    const result = await db.select().from(claims).where(eq(claims.user_id, id))
    console.log("result from DB", result)
    return result
}

// verifier, approver1, approver2
export const fetchAllClaims = async (): Promise<Array<{
  claim: {
    id: string;
    rememberable_id: string;
    user_id: string;
    title: string;
    description: string | null;
    amount: number;
    spent_date: Date;
    status: 'draft' | 'submitted' | 'reviewed' | 'reversed' | 'approved' | 'rejected' | 'waitlisted';
    created_at: Date;
    updated_at: Date;
    submitted_at: Date | null;
    reviewed_at: Date | null;
    resolved_at: Date | null;
    resolved_by: string | null;
    rejection_reason: string | null;
    waitlist_reason: string | null;
  };
  user: {
    name: string;
  };
}>> => {
  // join claims with the name from users table
  const result = await db.select({
    claim: claims,
    user: {
      name: usersTable.name
    }
  }).from(claims).innerJoin(usersTable, eq(claims.user_id, usersTable.user_id));
  
  console.log("result from Drizzle", result);
  return result as unknown as Array<{
    claim: {
      id: string;
      rememberable_id: string;
      user_id: string;
      title: string;
      description: string | null;
      amount: number;
      spent_date: Date;
      status: 'draft' | 'submitted' | 'reviewed' | 'reversed' | 'approved' | 'rejected' | 'waitlisted';
      created_at: Date;
      updated_at: Date;
      submitted_at: Date | null;
      reviewed_at: Date | null;
      resolved_at: Date | null;
      resolved_by: string | null;
      rejection_reason: string | null;
      waitlist_reason: string | null;
    };
    user: {
      name: string;
    };
  }>;
};