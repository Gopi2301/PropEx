import React from "react";
import ClaimViewClient from "./ClaimViewClient";
import { fetchClaimByClaimId} from "@/lib/actions/claim.action";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const {id} = params;
  const claims = await fetchClaimByClaimId(id);
  return <ClaimViewClient initialClaims={claims} />
};

export default Page;
