"use client";

import { Claim, ClaimAttachment } from '@/lib/src/db/schema';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';



interface ClaimViewClientProps {
  initialClaims?: Array<{
    claim: Claim;
    user: {
      name: string;
    };
    attachments:ClaimAttachment[];
  }>;
}

const ClaimViewClient = ({initialClaims=[]}: ClaimViewClientProps) => {
  const [loading, setLoading] = useState(false);
  const [claims, setClaims] = useState(initialClaims || []);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const claimId = params.id as string;
  const claim = claims[0];
  const attachments = Array.isArray(claim.attachments) ? claim.attachments : [];
  if(!claims.length || !claims){
    return <div>No claims found</div>
  }
  return (
    <>
     <div>{claim.claim.title}</div>
     <div>{claim.user.name}</div>
     <div>{claim.claim.amount}</div>
     <div>{claim.claim.status}</div>
     <div>{claim.claim.spent_date}</div>
     <div>{claim.claim.description}</div>
     <div>{attachments.map((attachment) => attachment.file_name)}</div>
    </> 
  )
};

export default ClaimViewClient;