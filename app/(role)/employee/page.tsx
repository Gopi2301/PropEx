import ClaimsTable from "@/components/claims/ClaimsTable";
import AddClaim from "@/components/ui/AddClaim";
import { getRoleFromCookie, getUserRoles } from "@/lib/actions/user.action";
import { Claim } from "@/lib/src/db/schema";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


const Employee = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/sign-in");
  }
  // get role from browser cookie
  const role = await getUserRoles(data.user.id);
  console.log("role", role);
  if (role[0].role !== "employee") {
    // If no role or invalid role, redirect to unauthorized
    console.warn(`Invalid or missing role. Expected 'employee', got '${role}'`);
    redirect("/unauthorized");
  }
// Fetch claims for the current user
const fetchClaims = async (): Promise<Claim[]> => {
  try {
    const { data: claims, error } = await supabase
      .from("claims")
      .select("*")
      .eq("user_id", data.user.id);
    
    if (error) {
      console.warn("Error fetching claims:", error);
      return [];
    }
    
    console.log("Claims fetched successfully:", claims);
    return claims as Claim[];
  } catch (error) {
    console.error("Unexpected error fetching claims:", error);
    return [];
  }
};

  // Fetch claims before rendering the component
  const claims = await fetchClaims();
  
  return (
    <div>
      {/* top div with add claim button  */}
      <div className="flex justify-end">
        <AddClaim />
      </div>
      {/* claims table */}
      <div className="mt-4 h-[calc(100vh-200px)]">
        <ClaimsTable initialClaims={claims} userRole={role[0].role} userId={data.user.id} />
      </div>
    </div>
  );
};

export default Employee;
