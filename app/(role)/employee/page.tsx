import ClaimsTable from "@/components/claims/ClaimsTable";
import AddClaim from "@/components/ui/AddClaim";
import { fetchClaimById } from "@/lib/actions/claim.action";
import { getRoleFromCookie, getUserRoles } from "@/lib/actions/user.action";
import { normalizeEmployeeClaims } from "@/lib/normailzeClaim";
import { testConnection } from "@/lib/src";
import { Claim } from "@/lib/src/db/schema";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {userRole} from "@/types/user"

const Employee = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/sign-in");
  }
  // get role from browser cookie
    const role:userRole[] = await getUserRoles(data.user.id);
  if (role[0].role !== "employee") {
    // If no role or invalid role, redirect to unauthorized
    console.warn(`Invalid or missing role. Expected 'employee', got '${role}'`);
    redirect("/unauthorized");
  }

  const claims = await fetchClaimById(data.user.id);
  const normalizedClaims = normalizeEmployeeClaims(claims);
    await testConnection();
  return (
    <div>
      {/* top div with add claim button  */}
      <div className="flex justify-end">
        <AddClaim />
      </div>
      {/* claims table */}
      <div className="mt-4 h-[calc(100vh-200px)]">
        <ClaimsTable claims={normalizedClaims} userRole={role[0].role} userId={data.user.id}/>
      </div>
    </div>
  );
};

export default Employee;
