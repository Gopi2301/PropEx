"use client"
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import React from 'react'

const Unauthorized = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
        <h1>Unauthorized</h1>
        <p>You do not have access to this page.</p>
        <Button onClick={() => redirect('/sign-in')}>Sign In</Button>
    </div>
  )
}

export default Unauthorized