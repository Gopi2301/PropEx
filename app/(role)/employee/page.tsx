import ClaimsTable from "@/components/claims/ClaimsTable";
import AddClaim from "@/components/ui/AddClaim";
import { getRoleFromCookie } from "@/lib/actions/user.action";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Employee = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/unauthorized");
  }
  // get role from browser cookie
  const role = await getRoleFromCookie();
  console.log("role", role);
  if (role !== "employee") {
    // If no role or invalid role, redirect to unauthorized
    console.warn(`Invalid or missing role. Expected 'employee', got '${role}'`);
    redirect("/unauthorized");
  }

  return (
    <div>
      {/* top div with add claim button  */}
      <div className="flex justify-end">
        <AddClaim />
      </div>
      {/* claims table */}
      <div className="mt-4 h-[calc(100vh-200px)]">
        <ClaimsTable initialClaims={[]} userRole={role} userId={data.user.id} />
      </div>
    </div>
  );
};

export default Employee;
