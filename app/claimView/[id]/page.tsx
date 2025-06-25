"use client"
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
    const {id} = useParams();
    console.log(id);
    
  return (
    <div>Claim View</div>
  )
}

export default page