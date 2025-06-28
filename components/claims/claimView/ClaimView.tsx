import ClaimViewClient from './ClaimViewClient';
import { fetchClaimByClaimId } from '@/lib/actions/claim.action';
import { NormalizedClaim } from '@/types/claim';

interface ClaimViewProps {
  claim: NormalizedClaim;
}

const ClaimView = ({ claim }: ClaimViewProps) => {
  return <ClaimViewClient claim={claim} />;
};

export default ClaimView;