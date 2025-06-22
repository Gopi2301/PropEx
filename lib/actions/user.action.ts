'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = await createClient()

  try {
    // Log form data for debugging
    const formDataObj = Object.fromEntries(formData.entries());
    console.log('Form data received:', formDataObj);

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('Attempting to sign in with:', { email });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error)
      if (error.code === 'email_not_confirmed') {
        throw new Error('Email not confirmed. Please check your email for the confirmation link.')
      }
      throw new Error(error.message || 'Failed to sign in. Please check your credentials.')
    }

    console.log('Login successful, user:', data.user?.email);

    // Update last login time
    if (data.user) {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('user_id', data.user.id);
    }
    //  get user roles
    const roles = await getUserRoles();
    const role = roles.find((role) => role.user_id === data.user.id);
    console.log('User roles:', role);
    const cookieStore = await cookies();
    cookieStore.set('role', role?.role);
    revalidatePath('/')
    redirect(`/${role?.role}`)
  }

  catch (error) {
    console.error('Login error in catch block:', error)
    throw error // Re-throw to be caught by the form's error handling
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  // First sign up the user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  })

  if (signUpError) {
    console.error('Signup error:', signUpError)
    throw new Error(signUpError.message || 'Failed to create account')
  }

  // Update the user id in users table and assign default role
  if (authData.user) {
    const { error: userError } = await supabase
      .from('users')
      .insert({
        user_id: authData.user.id,
        name: username,
        email,
        last_login: new Date().toISOString()
      })

    if (userError) {
      console.error('User update error:', userError)
      throw new Error('Account created but failed to set up profile')
    }

    // Assign default 'employee' role to new user
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'employee'
      })

    if (roleError) {
      console.error('Role assignment error:', roleError)
      throw new Error('Account created but failed to assign default role')
    }
  }

  revalidatePath('/')
  redirect('/account')
}

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign out error:', error)
    throw new Error(error.message || 'Failed to sign out')
  }

  revalidatePath('/')
  redirect('/sign-in')
}

export async function getUserRoles() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('user_roles').select('*')
  if (error) {
    console.error('Error fetching user roles:', error)
    throw new Error('Failed to fetch user roles')
  }
  return data
}
 // get role from cookie
export const getRoleFromCookie = async () => {
    const cookieStore = await cookies();
    const role = cookieStore.get('role')?.value;
    if (!role) {
      throw new Error('No role found in cookie');
    }
    return role;
  }