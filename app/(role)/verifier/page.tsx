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

  const claims = await fetchAllClaims();
  return (
    <>
      {/* Top div with add claim button */}
      <div className="flex justify-end">
        <AddClaim />
      </div>
      
      {/* Claims table */}
      <div className="mt-4 h-[calc(100vh-200px)]">
        <ClaimsTable 
          claims={claims} 
          userRole={role[0].role} 
          userId={data.user.id}
        />
      </div>
    </>
  );
};

export default VerifierPage;