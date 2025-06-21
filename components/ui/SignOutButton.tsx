"use client";

import { signOut } from "@/lib/actions/user.action"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Button 
      variant="outline"
      onClick={handleSignOut}
      className="w-full"
    >
      Sign Out
    </Button>
  )
}
