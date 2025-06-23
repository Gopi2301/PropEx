"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import {createClient} from '@/utils/supabase/client'
import { Claim } from '@/lib/src/db/schema';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PostgrestError } from '@supabase/supabase-js';
import { Button } from '../ui/button';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';

type ClaimsTableProps = {
    initialClaims: Claim[];
    userRole: 'employee' | 'verifier' | 'approver1' | 'approver2';
    userId: string;
  };

  
const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ]

const ClaimsTable = ({initialClaims, userRole, userId}: ClaimsTableProps) => {
    const [claims, setClaims] = useState(initialClaims);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<PostgrestError | null>(null);
    
    useEffect(()=>{
        const fetClaims = async()=>{
            const supabase = await createClient();
            const {data, error} = await supabase.from('claims').select('*').eq('user_id', userId);
            if(error){
                console.warn('Error fetching claims:', error);
                setError(error);
                setLoading(false);
            }
            if(data){
                setClaims(data);
                console.log('Claims fetched successfully:', data);
                setLoading(false);
            }
        }
        fetClaims();
    },[])
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
            <TableCell className="font-medium">{claim.rememberable_id}</TableCell>
            <TableCell>{claim.title}</TableCell>
            <TableCell>{claim.spent_date}</TableCell>
            <TableCell >{claim.amount}</TableCell>
            <TableCell >{claim.status}</TableCell>
            <TableCell className="text-center">
                <Button variant="ghost"><EyeIcon /></Button>
                <Button variant="ghost"><PencilIcon /></Button>
                <Button variant="destructive"><TrashIcon /></Button>
            </TableCell>
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
  )
}

export default ClaimsTable