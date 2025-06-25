import ClaimsTable from '@/components/claims/ClaimsTable';
import AddClaim from '@/components/ui/AddClaim';
import { fetchAllClaims } from '@/lib/actions/claim.action';
import { getRoleFromCookie, getUserRoles } from '@/lib/actions/user.action';
import { normalizeVerifierClaims } from '@/lib/normailzeClaim';
import { Claim } from '@/lib/src/db/schema';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';

const VerifierPage = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    redirect("/unauthorized");
  }

  // Get role from user data
  const role = await getUserRoles(data.user.id);
  console.log("role", role);
  
  if (role[0].role !== "verifier") {
    console.warn(`Invalid or missing role. Expected 'verifier', got '${role}'`);
    redirect("/unauthorized");
  }

  const fetchClaims = async (): Promise<Array<{
    claim: {
      id: string;
      rememberable_id: string;
      user_id: string;
      title: string;
      description: string | null;
      amount: number;
      spent_date: string;
      status: 'draft' | 'submitted' | 'reviewed' | 'reversed' | 'approved' | 'rejected' | 'waitlisted';
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
  }>> => {
    try {
      const result = await fetchAllClaims();
      if (!result) return [];
      
      // Transform the data to match the expected format
      return result.map(item => ({
        claim: {
          ...item.claim,
          // Ensure dates are strings
          created_at: item.claim.created_at.toString(),
          updated_at: item.claim.updated_at.toString(),
          spent_date: item.claim.spent_date.toString(),
          submitted_at: item.claim.submitted_at?.toString() || null,
          reviewed_at: item.claim.reviewed_at?.toString() || null,
          resolved_at: item.claim.resolved_at?.toString() || null,
        },
        user: {
          name: item.user?.name || ''
        }
      }));
    } catch (error) {
      console.error(`Error fetching claims: ${error}`);
      return [];
    }
  };

  // Fetch claims before rendering the component
  const claimsData = await fetchClaims();
  const normalizedClaims = normalizeVerifierClaims(claimsData);
  
  return (
    <>
      {/* Top div with add claim button */}
      <div className="flex justify-end">
        <AddClaim />
      </div>
      
      {/* Claims table */}
      <div className="mt-4 h-[calc(100vh-200px)]">
        <ClaimsTable 
          claims={normalizedClaims} 
          userRole={role[0].role} 
          userId={data.user.id}
        />
      </div>
    </>
  );
};

export default VerifierPage;