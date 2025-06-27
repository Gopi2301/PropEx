import { NextResponse } from 'next/server'
import { fetchClaimByClaimId } from '@/lib/actions/claim.action'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const claim = await fetchClaimByClaimId(params.id)
    return NextResponse.json(claim)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch claim' },
      { status: 500 }
    )
  }
}