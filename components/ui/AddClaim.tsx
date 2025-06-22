"use client"
import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import { useForm } from 'react-hook-form'
import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from './input'
import { Button } from './button'
import { createClient } from '@/utils/supabase/client'


const AddClaim = () => {
const formSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(50, 'Title is too long'),
    description: z.string().min(2, 'Description must be at least 2 characters').max(50, 'Description is too long'),
    amount: z.string().refine((amount)=>{
        const parsedAmount = Number(amount)
        return !isNaN(parsedAmount) && parsedAmount > 0
    }, {
        message: 'Amount must be a positive number'
    }),
    spent_date: z.string().refine((date)=>{
        const selectedDate = new Date(date)
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return selectedDate <= today
    }, {
        message: 'Spent date must be today or in the past'
    })
})
const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        description: "",
        amount: undefined,
        spent_date: new Date().toISOString().split('T')[0],
    },
})
const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        // add claim to database
        const supabase = createClient();
        const { data, error } = await supabase.from('claims').insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            title: values.title,
            description: values.description,
            amount: values.amount,
            spent_date: values.spent_date,
        })
        if (error) {
            throw error
        }
        form.reset()
    } catch (error) {
        console.log(error)
    }
}
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>Add Claim</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Claim</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          {/* render form title, description, amount */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Amount"
                      {...field}
                      value={field.value ? Number(field.value) : undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
             control={form.control}
             name="spent_date"
             render={({ field }) => (
                <FormItem>
                  <FormLabel>Spent Date</FormLabel>
                  <FormControl>
                  <Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            >

            </FormField>
            <Button className="w-full mt-4" type="submit">Submit</Button>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <button>Close</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default AddClaim