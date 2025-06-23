"use client";
import React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Claim } from "@/lib/src/db/schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PostgrestError } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import getStatusBadgeVariant from "@/constants";

type ClaimsTableProps = {
  initialClaims: Claim[];
  userRole: "employee" | "verifier" | "approver1" | "approver2";
  userId: string;
};

const ClaimsTable = ({ initialClaims, userRole, userId }: ClaimsTableProps) => {
  const [claims, setClaims] = useState(initialClaims);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  // fetch claims
  const fetchClaims = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("claims")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      console.warn("Error fetching claims:", error);
      setError(error);
      setLoading(false);
    }
    if (data) {
      setClaims(data);
      console.log("Claims fetched successfully:", data);
      setLoading(false);
    }
  };
  //  render actions based on role
  const renderActions = (claim: Claim) => {
    if (userRole === "employee") {
      if (claim.status === "draft" || "submitted" || "reversed") {
        return (
          <>
            <Button variant="outline" className="mr-2">
              <EyeIcon className="" />
            </Button>
            <Button variant="outline" className="mr-2">
              <PencilIcon className="" />
            </Button>
            <Button variant="outline" className="mr-2 ">
              <TrashIcon className="" />
            </Button>
          </>
        );
      } else if (claim.status === "approved" || "pending" || "waitlisted") {
        return (
          <>
            <Button variant="outline" className="mr-2">
              <EyeIcon className="" />
            </Button>
            <Button disabled variant="outline" className="mr-2">
              <PencilIcon className=" opacity-50" />
            </Button>
            <Button disabled variant="outline" className="mr-2">
              <TrashIcon className=" opacity-50" />
            </Button>
          </>
        );
      } else {
        return (
          <>
            <Button variant="outline" className="mr-2">
              <EyeIcon className="" />
            </Button>
            <Button disabled variant="outline" className="mr-2">
              <PencilIcon className=" opacity-50" />
            </Button>
            <Button variant="outline" className="mr-2">
              <TrashIcon className=" " />
            </Button>
          </>
        );
      }
    }
  };
  // fetch claims on mount
  useEffect(() => {
    fetchClaims();
  }, []);
  return (
    <Table>
      <TableCaption>A list of your recent Claims.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Claim ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Spent Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {claims.map((claim) => (
          <TableRow key={claim.id}>
            <TableCell className="font-medium">
              {claim.rememberable_id}
            </TableCell>
            <TableCell>{claim.title}</TableCell>
            <TableCell>{claim.spent_date}</TableCell>
            <TableCell>{claim.amount}</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(claim.status)}>
                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="text-center">{renderActions(claim)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-center">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
};

export default ClaimsTable;
