import { createClient } from "@/utils/supabase/server";
import { claimAttachments, claims, usersTable } from "../src/db/schema";
import db from "../src";
import { desc, eq } from "drizzle-orm";
// import { eq } from "drizzle-orm";
// employee
export const fetchClaimByUserId = async (id: string) => {
  const claimsData = await db.select().from(claims).where(eq(claims.user_id, id));
  const claimId = claimsData.map((claim) => claim.id);
  const attachmentsData = [] as { attachments: any[] }[];
  for(const claim of claimId){
    const attachments = await db.select().from(claimAttachments).where(eq(claimAttachments.claim_id, claim));
    attachmentsData.push({
      attachments,
    });
  }
  const claimsWithAttachments = claimsData.map((claim, index)=>{
    return {
      ...claim,
      attachments: attachmentsData[index].attachments,
    }
  })
  return claimsWithAttachments;
};

// verifier, approver1, approver2
export const fetchAllClaims = async ()=>{
 const claimsData = await db.select().from(claims).orderBy(desc(claims.created_at));
 const claimId = claimsData.map((claim) => claim.id);
 const attachmentsData = [] as { attachments: any[] }[];
 for(const claim of claimId){
   const attachments = await db.select().from(claimAttachments).where(eq(claimAttachments.claim_id, claim));
   attachmentsData.push({
     attachments,
   });
 }
 const claimsWithAttachments = claimsData.map((claim, index)=>{
   return {
     ...claim,
     attachments: attachmentsData[index].attachments,
   }
 })
 return claimsWithAttachments;
}
export const fetchClaimByClaimId = async (id: string) => {
  // join claims with name from users table, claim details from claims, and attachments from claim attachments
  const row = await db
    .select({
      claim: claims,
      user: { name: usersTable.name },
      attachment: claimAttachments,
    })
    .from(claims)
    .innerJoin(usersTable, eq(claims.user_id, usersTable.user_id))
    .innerJoin(claimAttachments, eq(claims.id, claimAttachments.claim_id))
    .where(eq(claims.id, id));
  if (row.length === 0) {
    return null;
  }
  const { claim, user } = row[0];
  const attachments = row.map((r) => r.attachment);
  
  return {
    claim,
    user,
    attachments,
  };
};
export const fetchClaimsWithAttachments = async (claimId: string) => {
  const result = await db
    .select()
    .from(claimAttachments)
    .where(eq(claimAttachments.claim_id, claimId));
  return result;
};
