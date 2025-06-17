'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

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
      throw new Error(error.message || 'Failed to sign in. Please check your credentials.')
    }

    console.log('Login successful, user:', data.user?.email);
    revalidatePath('/')
    return redirect('/account')
  } catch (error) {
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

  // Update the user's profile with the username if needed
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', authData.user.id)

    if (profileError) {
      console.error('Profile update error:', profileError)
      throw new Error('Account created but failed to set up profile')
    }
  }

  revalidatePath('/')
  redirect('/account')
}