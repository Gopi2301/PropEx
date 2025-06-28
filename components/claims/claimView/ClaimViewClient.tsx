"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Claim, ClaimAttachment } from "@/lib/src/db/schema";
import { NormalizedClaim } from "@/types/claim";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ClaimData {
  claim: Claim;
  user: {
    name: string;
  };
  attachments: ClaimAttachment[];
}

interface ClaimViewClientProps {
  claimId?: string;
  claim?: NormalizedClaim;
}

const attachmentUrl = (attachment: ClaimAttachment) => {
  // https://tfrcrrtavnbqgselqkdz.supabase.co/storage/v1/object/public/claim-attachments/440a2748-8133-4e24-9647-675685fa8330/22237c5f-ee9a-4d50-9a2c-ae09a34ec6a1-0-mobile-logo.png
  const url = `https://tfrcrrtavnbqgselqkdz.supabase.co/storage/v1/object/public/claim-attachments/${attachment.file_path}`;
  console.log("url", url);
  return url;
};

const ClaimViewClient = ({
  claimId,
  claim: initialClaim,
}: ClaimViewClientProps) => {
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [isLoading, setIsLoading] = useState(!initialClaim);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const currentClaim = initialClaim;
  const user = claimData?.user;

  if (isLoading && !currentClaim) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!currentClaim) {
    return null;
  }
  console.log("claimData", currentClaim);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <EyeIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentClaim.title}</DialogTitle>
          <DialogDescription>{currentClaim.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <p>Amount: {currentClaim.amount}</p>
          <p>Spent Date: {currentClaim.spent_date?.toString()}</p>
          <p>Status: {currentClaim.status}</p>
          {user?.name && <p>Submitted By: {user.name}</p>}
        </div>
        {currentClaim.attachments && currentClaim.attachments.length > 0 && (
          <div>
            <h4>Attachments:</h4>
            <ul className="flex gap-4 flex-wrap">
              {currentClaim.attachments.map((attachment) => (
                <li key={attachment.id} className="relative">
                  <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={attachmentUrl(attachment)}
                      alt={attachment.file_name}
                      width={100}
                      height={100}
                      className="object-contain w-full h-full"
                      style={{ 
                        maxWidth: "100%",
                        height:'auto',
                        aspectRatio:'3/2'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={attachmentUrl(attachment)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900"
                        aria-label="View Full Size"
                      >
                        View Full Size
                      </Link>
                    </div>
                  </div>
                  <p className="mt-2 block truncate text-sm font-medium text-gray-900">
                    {attachment.file_name.split("-").pop()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimViewClient;
