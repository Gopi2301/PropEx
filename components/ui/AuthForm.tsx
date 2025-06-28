"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import {login, signup} from "@/lib/actions/user.action"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type } from "os";

type FormType = "sign-in" | "sign-up";

const AuthForm = ({ type }: { type: FormType }) => {
  const formSchema = type === 'sign-up' 
    ? z.object({
        username: z.string().min(2, 'Username must be at least 2 characters').max(50, 'Username is too long'),
        email: z.string().email('Please enter a valid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
      })
    : z.object({
        // For sign-in, we only need email and password
        email: z.string().email('Please enter a valid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        // Add username to match the type, but it won't be used
        username: z.string().optional(),
      });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email:"",
      password:""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('email', values.email.trim());
      formData.append('password', values.password);
      
      // Only append username if it exists and we're signing up
      if (type === 'sign-up' && values.username) {
        formData.append('username', values.username.trim());
      }
      

      
      if (type === 'sign-in') {
        const loginResult = await login(formData);
      } else {
        
        const signupResult = await signup(formData);
        
      }
    } catch (err) {
      console.error('Form submission error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An error occurred during form submission';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        <h1 className="form-title">{type === "sign-in" ? "Sign In" : "Sign Up"}</h1>
        
        {type === "sign-up" && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="Enter Your Email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" placeholder="Enter Your Password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <Button type="submit" className="w-full form-submit-button" disabled={isLoading} >
      {type === "sign-in" ? "Sign In" : "Sign Up"}
    </Button>
    
    {error && <p className="text-red-500">{error}</p>}
    <div>
      <p>{type === "sign-in" ? "Don't have an account?" : "Already have an account?"}</p>
      <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"}>
        Click here to {type === "sign-in" ? "Sign Up" : "Sign In"}
      </Link>
    </div>
  </form>
</Form>
  );
};

export default AuthForm;
