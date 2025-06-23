import ClaimsTable from "@/components/claims/ClaimsTable";
import AddClaim from "@/components/ui/AddClaim";
import { Button } from "@/components/ui/button";
import { getRoleFromCookie } from "@/lib/actions/user.action";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Employee = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/unauthorized");
  }
  // get role from cookie
  const role = await getRoleFromCookie();
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
