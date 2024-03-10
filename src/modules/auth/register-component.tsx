"use client";
import React, { useCallback, useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowUpIcon,
  CalendarIcon,
  Check,
  FileWarningIcon,
  X
} from "lucide-react";
import Loader from "@/components/loader/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { type FileRejection, useDropzone } from "react-dropzone";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { BackendUrl } from "@/constants/data";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "firstName must be at least 2 characters."
  }),
  lastName: z.string().min(2, {
    message: "lastName must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Invalid email address."
  }),
  phoneNumber: z.string().min(10, {
    message: "phoneNumber must be at least 10 characters."
  }),
  username: z.string().min(4, {
    message: "Username must be at least 4 characters."
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters."
  }),
  addressLine1: z.string().min(4, {
    message: "Address line 1 must be at least 4 characters."
  }),
  addressLine2: z.string(),
  city: z.string().min(2, {
    message: "City must be at least 2 characters."
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters."
  }),
  nationality: z.string().min(2, {
    message: "National must be at least 2 characters."
  }),
  zipCode: z.string().min(4, {
    message: "Zip code must be at least 4 characters."
  }),
  type: z.enum(["PASSPORT", "NATIONAL_ID", "DRIVERS_LICENSE"], {
    required_error: "You must to select a type."
  }),
  dob: z.date({
    required_error: "A date of birth is required."
  })
});
const RegisterComponent = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      username: "",
      password: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      nationality: "",
      zipCode: ""
    }
  });

  // image upload

  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const [rejected, setRejected] = useState<FileRejection[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles?.length) {
        setFiles(previousFiles => [
          ...previousFiles,
          ...acceptedFiles.map(file =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          )
        ]);
      }

      if (rejectedFiles?.length) {
        setRejected(previousFiles => [...previousFiles, ...rejectedFiles]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": []
    },
    maxSize: 1024 * 5000,
    onDrop
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name: string) => {
    setFiles(files => files.filter(file => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
  };

  const removeRejected = (name: string) => {
    setRejected(files => files.filter(({ file }) => file.name !== name));
  };

  //

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
      password,
      addressLine1,
      addressLine2,
      city,
      dob,
      nationality,
      state,
      zipCode,
      type
    } = values;

    if (!files?.length) {
      setShowError(true);
      setErrorMessage("You must upload at least one file.");

      toast("You must upload at least one file", {
        // className: "bg-dark text-white",
        duration: 10000,
        position: "top-right",
        icon: <FileWarningIcon className="h-4 w-4" />,
        closeButton: true,
        style: {
          padding: "1rem",
          borderRadius: "0.5rem",
          backgroundColor: "red",
          color: "#fff"
        }
      });

      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phoneNumber);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("addressLine1", addressLine1);
    formData.append("addressLine2", addressLine2);
    formData.append("city", city);
    formData.append("dob", dob.toISOString());
    formData.append("nationality", nationality);
    formData.append("state", state);
    formData.append("zipCode", zipCode);
    formData.append("documentType", type);

    files.forEach(file => formData.append("files", file));

    try {
      axios.defaults.baseURL = BackendUrl;
      const { data } = await axios.post("/api/v1/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (data.success) {
        toast(data.data.message as string, {
          // className: "bg-dark text-white",
          duration: 10000,
          position: "top-right",
          icon: <Check className="h-4 w-4" />,
          closeButton: true,
          style: {
            padding: "1rem",
            borderRadius: "0.5rem",
            backgroundColor: "green",
            color: "#fff"
          }
        });
      }

      router.push("/login");

      setLoading(false);
    } catch (error: unknown) {
      console.log(error);
      setShowError(true);
      setErrorMessage((error as Error)?.message ?? "Something went wrong");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <main className="flex flex-col items-center justify-center p-2">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Begin your ID-Verification</h1>
          <p className="font-semibold mt-4">
            To comply with regulation each participant will have to go through
            indentity verification (KYC/AML) to prevent fraud causes.
          </p>
        </div>

        <div className="flex flex-col space-y-2 justify-center min-h-fit ">
          {/* <h1 className="text-2xl xl:text-3xl font-extrabold">Sign In</h1> */}
          <div className="">
            {showError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errorMessage ?? "Something went wrong"}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="max-w-screen-xl w-full flex flex-col gap-4 mt-10"
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your simple personal information required for identification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="First Name"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Last Name"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Email address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email address"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Phone number</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone" type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />{" "}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Username"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={date =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle>Your Address</CardTitle>
                <CardDescription>
                  Your simple personal information required for identification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>
                            Address line 1{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Address line 1"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Address line 2 </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Address line 2"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>
                            City
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Address line 1"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>
                            State
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="State" type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>
                            Nationality
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nationality"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>
                            Zip code
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Zip code"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle>File Upload</CardTitle>
                <CardDescription>
                  Your simple personal information required for identification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-bold">
                        What type of document would you like to upload?
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="PASSPORT" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Passport
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="NATIONAL_ID" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              National ID
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="DRIVERS_LICENSE" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Driving License
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div
                  {...getRootProps({
                    className:
                      "p-16 mt-10 border border-4 border-black rounded-md p-16 mt-10"
                  })}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center gap-4">
                    <ArrowUpIcon className="w-5 h-5 fill-current" />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <p>Drag & drop files here, or click to select files</p>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <section className="mt-10">
                  <div className="flex gap-4">
                    <h2 className="title text-3xl font-semibold">Preview</h2>
                    <button
                      type="button"
                      onClick={removeAll}
                      className="ml-auto mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-purple-400 rounded-md px-3 hover:bg-purple-400 hover:text-white transition-colors"
                    >
                      Remove all files
                    </button>
                  </div>

                  {/* Accepted files */}
                  <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">
                    Accepted Files
                  </h3>
                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
                    {files.map(file => (
                      <li
                        key={file.name}
                        className="relative h-32 rounded-md shadow-lg"
                      >
                        <Image
                          src={file.preview}
                          alt={file.name}
                          width={100}
                          height={100}
                          onLoad={() => {
                            URL.revokeObjectURL(file.preview);
                          }}
                          className="h-full w-full object-contain rounded-md"
                        />
                        <button
                          type="button"
                          className="w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                          onClick={() => removeFile(file.name)}
                        >
                          <X className="w-5 h-5 fill-white hover:fill-secondary-400 transition-colors" />
                        </button>
                        <p className="mt-2 text-neutral-500 text-[12px] font-medium">
                          {file.name}
                        </p>
                      </li>
                    ))}
                  </ul>

                  {/* Rejected Files */}
                  <h3 className="title text-lg font-semibold text-neutral-600 mt-24 border-b pb-3">
                    Rejected Files
                  </h3>
                  <ul className="mt-6 flex flex-col">
                    {rejected.map(({ file, errors }) => (
                      <li
                        key={file.name}
                        className="flex items-start justify-between"
                      >
                        <div>
                          <p className="mt-2 text-neutral-500 text-sm font-medium">
                            {file.name}
                          </p>
                          <ul className="text-[12px] text-red-400">
                            {errors.map(error => (
                              <li key={error.code}>{error.message}</li>
                            ))}
                          </ul>
                        </div>
                        <button
                          type="button"
                          className="mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors"
                          onClick={() => removeRejected(file.name)}
                        >
                          remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              </CardContent>

              <CardFooter className="flex justify-evenly">
                <Button asChild variant={"destructive"}>
                  <Link href="/login">Back to Login</Link>
                </Button>
                <Button type="submit">Submit</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </main>
    </>
  );
};

export default RegisterComponent;
