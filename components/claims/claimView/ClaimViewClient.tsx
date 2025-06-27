"use client"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { Claim, ClaimAttachment } from '@/lib/src/db/schema'
import { NormalizedClaim } from '@/types/claim'
import { EyeIcon } from 'lucide-react'

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

const ClaimViewClient = ({ claimId, claim: initialClaim }: ClaimViewClientProps) => {
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [isLoading, setIsLoading] = useState(!initialClaim);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchClaim = async () => {
      if (!claimId || initialClaim) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/claims/${claimId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch claim');
        }
        const data = await response.json();
        setClaimData(data);
      } catch (error) {
        console.error('Error fetching claim:', error);
        setError('Failed to fetch claim');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && !initialClaim) {
      fetchClaim();
    }
  }, [claimId, isOpen, initialClaim]);

  const currentClaim = initialClaim || claimData?.claim;
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
          <DialogDescription>
            {currentClaim.description}
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4'>
          <p>Amount: {currentClaim.amount}</p>
          <p>Spent Date: {currentClaim.spent_date?.toString()}</p>
          <p>Status: {currentClaim.status}</p>
          {user?.name && <p>Submitted By: {user.name}</p>}
        </div>
        {claimData?.attachments && claimData.attachments.length > 0 && (
          <div>
            <h4>Attachments:</h4>
            <ul>
              {claimData.attachments.map(attachment => (
                <li key={attachment.id}>
                  <a href={attachment.file_path} target="_blank" rel="noopener noreferrer">
                    {attachment.file_name}
                  </a>
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