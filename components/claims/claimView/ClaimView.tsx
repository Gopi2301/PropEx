import ClaimViewClient from './ClaimViewClient';
import { fetchClaimByClaimId } from '@/lib/actions/claim.action';
import { NormalizedClaim } from '@/types/claim';

interface ClaimViewProps {
  claim: NormalizedClaim;
}

const ClaimView = ({ claim }: ClaimViewProps) => {
  console.log("claim for table",claim)
  return <ClaimViewClient claim={claim} />;
};

export default ClaimView;