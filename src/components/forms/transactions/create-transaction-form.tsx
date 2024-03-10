"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";
import { BackendUrl } from "@/constants/data";
import { CheckCircle2Icon, MessageCircleWarningIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" }),
  username: z
    .string()
    .min(3, { message: "username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
});

type FormValues = z.infer<typeof formSchema>;

export const CreateTransactionForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const session = useSession();

  const defaultValues = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: ""
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { firstName, lastName, username, email, phone, password } = data;

      // console.log(data);
      setLoading(true);

      const body = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        phone: phone,
        password: password,
        isActive: true
      };

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${session.data?.user.accessToken}`;

      await axios
        .post(`${BackendUrl}/api/v1/admins`, body, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res => {
          const message =
            (res.data.data.message as string) || "Admin created successfully";

          toast(message, {
            icon: (
              <CheckCircle2Icon className="text-success dark:text-success-foreground" />
            ),
            style: {
              color: "green"
            },
            closeButton: true,
            duration: 5000,
            position: "top-right"
          });

          router.refresh();
          router.push("/admin");
        })
        .catch(err => {
          console.log(err);

          toast(err.response.data.message as string, {
            icon: (
              <MessageCircleWarningIcon className="text-destructive dark:text-destructive-foreground" />
            ),
            closeButton: true,
            duration: 5000,
            style: {
              color: "red"
            },
            position: "top-right"
          });
        });
    } catch (error: any) {
      toast(error.message as string, {
        icon: "error",
        closeButton: true,
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-2 gap-8">
            {/* firstName */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="First Name"
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* lastName */}

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Last Name"
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center">
            <Button disabled={loading} className="bg-black" type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
