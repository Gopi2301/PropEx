import { Claim } from "@/lib/src/db/schema";

export type ClaimsTableProps = {
    claims: NormalizedClaim[];
    userRole: string;
    userId: string;
};

export interface ClaimWithUser {
  claim: {
    id: string;
    rememberable_id: string;
    user_id: string;
    title: string;
    description: string | null;
    amount: number;
    spent_date: string;
    status: ClaimStatus;
    created_at: string;
    updated_at: string;
    submitted_at: string | null;
    reviewed_at: string | null;
    resolved_at: string | null;
    resolved_by: string | null;
    rejection_reason: string | null;
    waitlist_reason: string | null;
  };
  user: {
    name: string;
  };
}
export type ClaimStatus = "draft" | "submitted" | "reviewed" | "reversed" | "approved" | "rejected" | "waitlisted";

export interface NormalizedClaim {
  id: string;
  rememberable_id: string;
  user_id: string;
  title: string;
  description?: string | null;
  amount: number;
  spent_date: string;
  status: ClaimStatus;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  rejection_reason: string | null;
  waitlist_reason: string | null;
  submitted_by?: string; // For verifier/approvers
}

export interface Claim {
    id: string;
    rememberable_id: string;
    user_id: string;
    title: string;
    description: string | null;
    amount: number;
    spent_date: string | Date;
    status: 'draft' | 'submitted' | 'reviewed' | 'reversed' | 'approved' | 'rejected' | 'waitlisted';
    created_at: string | Date;
    updated_at: string | Date;
    submitted_at: string | Date | null;
    reviewed_at: string | Date | null;
    resolved_at: string | Date | null;
    resolved_by: string | null;
    waitlist_reason: string | null;
}
export interface ClaimAttachment {
    id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    file_path: string;
    uploaded_at: Date;
}