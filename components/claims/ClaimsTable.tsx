"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PostgrestError } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import getStatusBadgeVariant from "@/constants";
import { ClaimsTableProps, NormalizedClaim, ClaimStatus } from "@/types/claim";
import Link from "next/link";
import ClaimView from "./claimView/ClaimView";

interface claims {
  claims: any[];
  userRole: string;
  userId: string;
}
const ClaimsTable = ({ claims, userRole, userId } :claims) => {
  const [claimData, setClaimData] = useState<NormalizedClaim[]>(claims);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  
  // render actions based on role
  const renderActions = (claim: NormalizedClaim) => {
    if (userRole === "employee") {
      if (claim.status === "draft" || claim.status === "submitted" || claim.status === "reversed") {
        return (
          <>
            <ClaimView claim={claim} />
            <Button variant="outline" className="mr-2">
              <PencilIcon className="" />
            </Button>
            <Button variant="destructive" className="mr-2 ">
              <TrashIcon className="" />
            </Button>
          </>
        );
      } else {
        return (
          <>
            <ClaimView claim={claim} />
            <Button disabled variant="outline" className="mr-2">
              <PencilIcon className="opacity-50" />
            </Button>
            <Button disabled variant="destructive" className="mr-2">
              <TrashIcon className="opacity-50" />
            </Button>
          </>
        );
      }
    } else {
      return (
        <>
          <ClaimView claim={claim} />
          <Button disabled variant="outline" className="mr-2">
            <PencilIcon className="opacity-50" />
          </Button>
          <Button variant="destructive" className="mr-2">
            <TrashIcon className="" />
          </Button>
        </>
      );
    }
  };
  // fetch claims on mount
  useEffect(() => {
    if (claims) {
      setClaimData(claims);
    }
  }, [claims]);
  return (
    <Table>
      <TableCaption>A list of your recent Claims.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Claim ID</TableHead>
         {userRole ==="verifier" && <TableHead>Submitted By</TableHead>}
          <TableHead>Title</TableHead>
          <TableHead>Spent Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {claimData.map((claim: NormalizedClaim) => (
          <TableRow key={claim.id}>
            <TableCell className="font-medium">
              {claim.rememberable_id}
            </TableCell>
            {userRole === "verifier" && <TableCell>{claim.submitted_by}</TableCell>}
            <TableCell>{claim.title}</TableCell>
            <TableCell>{claim.spent_date}</TableCell>
            <TableCell>{claim.amount}</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(claim.status)}>
                {claim.status ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1) : ""}
              </Badge>
            </TableCell>
            <TableCell className="text-center">{renderActions(claim)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClaimsTable;
