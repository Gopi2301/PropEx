"use client";

import { Claim } from '@/lib/src/db/schema';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';



interface ClaimViewClientProps {
  initialClaims: Claim[];
}

const ClaimViewClient = ({ initialClaims }: ClaimViewClientProps) => {
  const [loading, setLoading] = useState(false);
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const claimId = params.id as string;

  useEffect(() => {
    const refreshData = async () => {
      try {
        setLoading(true);
        // Implement refresh logic here if needed
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh data');
      } finally {
        setLoading(false);
      }
    };
  }, [claimId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!claims || claims.length === 0) {
    return <div>No claims found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Claim Details</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">{claims[0].title}</h2>
        <p className="text-gray-600 mb-4">Amount: ${claims[0].amount}</p>
        <p className="text-gray-600 mb-4">Status: {claims[0].status}</p>
        <p className="text-gray-600 mb-4">
          Spent Date: {new Date(claims[0].spent_date).toLocaleDateString()}
        </p>
        {claims[0].description && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Description:</h3>
            <p className="text-gray-700">{claims[0].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimViewClient;