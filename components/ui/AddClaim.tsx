"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./input";
import { Button } from "./button";
import { createClient } from "@/utils/supabase/client";

const AddClaim = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [attachments, setAttachments] = React.useState<FileList | null>(null);
  const formSchema = z.object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(50, "Title is too long"),
    description: z
      .string()
      .min(2, "Description must be at least 2 characters")
      .max(50, "Description is too long"),
    amount: z.string().refine(
      (amount) => {
        const parsedAmount = Number(amount);
        return !isNaN(parsedAmount) && parsedAmount > 0;
      },
      {
        message: "Amount must be a positive number",
      }
    ),
    spent_date: z.string().refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return selectedDate <= today;
      },
      {
        message: "Spent date must be today or in the past",
      }
    ),
    attachments: z.any().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      spent_date: new Date().toISOString().split("T")[0],
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // add claim to database
      setIsLoading(true);
    //   reset form
      handleReset();
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        setError("User not Authenticated");
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase.from("claims").insert({
        user_id: userData.user.id,
        title: values.title,
        description: values.description,
        amount: values.amount,
        spent_date: values.spent_date,
      });
    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }
      // add attachments to storage
      if (attachments) {
        console.log("attachments", attachments)
        // file naming convention
        const fileNames = Array.from(attachments).map(
          (file, index) => `${userData.user.id}-${index}-${file.name}`
        );
        const filePath = `${userData.user.id}/${fileNames[0]}`;
        const { data: storageData, error: storageError } =
          await supabase.storage
            .from("claim-attachments")
            .upload(filePath, attachments[0], {
              cacheControl: "3600",
              upsert: false,
            });
            if(storageData){
                console.log("storageData", storageData)
              }
            if(storageError){
                console.log("storageError", storageError)
              }
        if (storageError) {
          setError(storageError.message);
          setIsLoading(false);
          return;
        }
        console.log("attachments", attachments)
       
      }
     
      setIsLoading(false);
      handleReset();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleReset = () => {
    form.reset({
      title: "",
      description: "",
      amount: "",
      spent_date: new Date().toISOString().split("T")[0], // Reset to today's date
      attachments: undefined
    });
    setAttachments(null); // Clear the local attachments state
  };
  const handleAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachments(files);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Claim</Button>
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
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            {/* attach files */}
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachments</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      placeholder="Upload attachments"
                      onChange={handleAttachmentsChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full mt-4 disabled:opacity-50"
              disabled={isLoading}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <button onClick={handleReset}>Close</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddClaim;
