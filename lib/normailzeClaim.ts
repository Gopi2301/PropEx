import {NormalizedClaim} from "../types/claim"

export const normalizeEmployeeClaims =(claims: any[]): NormalizedClaim[] =>
    claims.map((claim)=>({
        ...claim,
    }))

interface ClaimWithUser {
  claim: {
    id: string;
    rememberable_id: string;
    user_id: string;
    title: string;
    description: string | null;
    amount: number;
    spent_date: Date | string;
    status: 'draft' | 'submitted' | 'reviewed' | 'reversed' | 'approved' | 'rejected' | 'waitlisted';
    created_at: Date | string;
    updated_at: Date | string;
    submitted_at: Date | string | null;
    reviewed_at: Date | string | null;
    resolved_at: Date | string | null;
    resolved_by: string | null;
    rejection_reason: string | null;
    waitlist_reason: string | null;
  };
  user: {
    name: string;
  };
}

export const normalizeVerifierClaims = (claims: ClaimWithUser[]): NormalizedClaim[] =>
  claims.map(({ claim, user }) => ({
    ...claim,
    spent_date: claim.spent_date instanceof Date ? claim.spent_date.toISOString() : claim.spent_date,
    created_at: claim.created_at instanceof Date ? claim.created_at.toISOString() : claim.created_at,
    updated_at: claim.updated_at instanceof Date ? claim.updated_at.toISOString() : claim.updated_at,
    submitted_at: claim.submitted_at instanceof Date ? claim.submitted_at.toISOString() : claim.submitted_at,
    reviewed_at: claim.reviewed_at instanceof Date ? claim.reviewed_at.toISOString() : claim.reviewed_at,
    resolved_at: claim.resolved_at instanceof Date ? claim.resolved_at.toISOString() : claim.resolved_at,
    submitted_by: user.name,
  }));