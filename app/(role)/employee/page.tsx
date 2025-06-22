import { getRoleFromCookie } from '@/lib/actions/user.action';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

const Employee = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();  
  if (error || !data.user) {
    redirect('/unauthorized');
  }
  // get role from cookie
  const role = await getRoleFromCookie();
  if (role !== 'employee') {
    redirect('/unauthorized');
  }

  return (
    <div>Employee</div>
  )
} 

export default Employee