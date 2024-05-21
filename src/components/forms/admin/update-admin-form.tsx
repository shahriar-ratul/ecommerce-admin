"use client";
import * as z from "zod";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import MultipleSelector, {
  type Option
} from "@/components/ui/multiple-selector";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command";

import { type FileRejection, useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

import { toast } from "sonner";
import axios from "axios";
import { BackendUrl, type SelectOption } from "@/constants/data";
import {
  ArrowUpIcon,
  CalendarIcon,
  Check,
  CheckCircle2Icon,
  ChevronsUpDown,
  MessageCircleWarningIcon,
  X
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { countries } from "@/constants/country";
import { Checkbox } from "@/components/ui/checkbox";
import { type RoleModel } from "@/schema/RoleSchema";
import Loader from "@/components/loader/loader";
import { type AdminModel } from "@/schema/AdminSchema";

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
  phone: z.string().min(1, { message: "Please enter a valid phone number" }),
  password: z.string().optional(),

  country: z.string().min(2, {
    message: "country must be at least 2 characters."
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters."
  }),
  state: z.string().min(2, {
    message: "state must be at least 2 characters."
  }),
  addressLine1: z
    .string()
    .min(4, {
      message: "Address line 1 must be at least 4 characters."
    })
    .optional(),
  addressLine2: z
    .string()
    .min(4, {
      message: "Address line 2 must be at least 4 characters."
    })
    .optional(),
  zipCode: z.string().min(4, {
    message: "Postcode must be at least 4 characters."
  }),
  dob: z
    .date({
      required_error: "A date of birth is required."
    })
    .optional(),
  joinedDate: z
    .date({
      required_error: "A date of birth is required."
    })
    .optional(),
  isActive: z.boolean().default(false),
  roles: z.array(z.object({ label: z.string(), value: z.number() }))
});

type FormValues = z.infer<typeof formSchema>;

interface PropData {
  item: AdminModel;
}

export const UpdateAdminForm = ({ item }: PropData) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [userRoles, setUserRoles] = useState<SelectOption[]>([]);

  const session = useSession();

  // image
  // image upload

  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const [rejected, setRejected] = useState<FileRejection[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles?.length) {
        // setFiles(previousFiles => [
        //   ...previousFiles,
        //   ...acceptedFiles.map(file =>
        //     Object.assign(file, { preview: URL.createObjectURL(file) })
        //   )
        // ]);
        setFiles(
          acceptedFiles.map(file =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          )
        );
      }

      if (rejectedFiles?.length) {
        setRejected(previousFiles => [...previousFiles, ...rejectedFiles]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    multiple: false,
    accept: {
      "image/*": []
    },
    maxSize: 1024 * 2048,
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

  const defaultValues = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    country: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    dob: item.dob ? new Date(item.dob) : undefined,
    joinedDate: item.joinedDate ? new Date(item.joinedDate) : undefined,
    roles: [],
    isActive: true
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const getRoles = async () => {
    const { data } = await axios.get(`${BackendUrl}/api/v1/common/all-roles`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data?.user.accessToken}`
      }
    });

    if (data.success) {
      if (data.data.roles.length > 0) {
        const items = data.data.roles.map((item: RoleModel) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setUserRoles(items as SelectOption[]);
      }
    }
  };

  useEffect(() => {
    getRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (item) {
      if (item.firstName) {
        form.setValue("firstName", item.firstName);
      }

      if (item.lastName) {
        form.setValue("lastName", item.lastName);
      }

      form.setValue("username", item.username);
      form.setValue("email", item.email);
      form.setValue("phone", item.phone);

      if (item.addressLine1) {
        form.setValue("addressLine1", item.addressLine1);
      }

      if (item.addressLine2) {
        form.setValue("addressLine2", item.addressLine2);
      }

      if (item.city) {
        form.setValue("city", item.city);
      }

      if (item.state) {
        form.setValue("state", item.state);
      }

      if (item.country) {
        form.setValue("country", item.country);
      }

      if (item.zipCode) {
        form.setValue("zipCode", item.zipCode);
      }

      if (item.dob) {
        form.setValue("dob", item.dob);
      }

      if (item.joinedDate) {
        form.setValue("joinedDate", item.joinedDate);
      }

      if (item.isActive) {
        form.setValue("isActive", item.isActive);
      }

      if (item.roles) {
        const roles = item.roles.map(item => {
          return {
            label: item.role.name,
            value: Number(item.roleId)
          };
        });
        form.setValue("roles", roles);
      }
    }
  }, [item]);

  const onSubmit = async (data: FormValues) => {
    console.log("data", data);
    // return;
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        phone,
        password,
        roles,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        zipCode,
        dob,
        joinedDate,
        isActive
      } = data;

      setLoading(true);

      const rolesArray = roles.map(({ value }) => value);

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone", phone);
  
      formData.append("roles", JSON.stringify(rolesArray));

      formData.append("city", city);
      formData.append("state", state);
      formData.append("country", country);
      formData.append("zipCode", zipCode);

      formData.append("isActive", JSON.stringify(isActive));

      if (password) {
          formData.append("password", password);
      }

      if (addressLine1) {
        formData.append("addressLine1", addressLine1);
      }

      if (addressLine2) {
        formData.append("addressLine2", addressLine2);
      }

      if (dob) {
        formData.append("dob", JSON.stringify(dob));
      }

      if (joinedDate) {
        formData.append("joinedDate", JSON.stringify(joinedDate));
      }

      if (files?.length > 0) {
        formData.append("image", files[0]);
      }

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${session.data?.user.accessToken}`;

      await axios
        .post(`${BackendUrl}/api/v1/admins`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
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
          router.push("/user/admins");
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
          {loading && <Loader />}
          {!loading && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your simple personal information required for identification
                </CardDescription>
              </CardHeader>

              <CardContent>
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
                        <FormLabel>lastName</FormLabel>
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

                  {/* username */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Username &nbsp;
                          <span className="text-destructive dark:text-destructive-foreground">
                            ( Username must be unique)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email &nbsp;
                          <span className="text-destructive dark:text-destructive-foreground">
                            (Email must be unique)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Email"
                            {...field}
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          phone &nbsp;
                          <span className="text-destructive dark:text-destructive-foreground">
                            (Please add country code before number)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            disabled={loading}
                            {...field}
                            placeholder="phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Password &nbsp;
                          <span className="text-destructive dark:text-destructive-foreground">
                            (Password at least 6 characters long)
                          </span>
                        </FormLabel>

                        <FormControl>
                          <Input
                            type="password"
                            disabled={loading}
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="joinedDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col p-2">
                        <FormLabel>Joined Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  " pl-3 text-left font-normal w-full",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd-MM-yyyy")
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
                                date < new Date("1970-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col p-2">
                        <FormLabel>Date of birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  " pl-3 text-left font-normal w-full",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd-MM-yyyy")
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
                                date < new Date("1970-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roles &nbsp; </FormLabel>
                        <FormControl>
                          <MultipleSelector
                            value={field.value as unknown as Option[]}
                            onChange={field.onChange}
                            options={userRoles as unknown as Option[]}
                            defaultOptions={userRoles as unknown as Option[]}
                            placeholder="Select roles"
                            emptyIndicator={
                              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                no results found.
                              </p>
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>

              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="mb-2">Country</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? countries.find(
                                      country => country.name === field.value
                                    )?.name
                                  : "Select a country"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search ..." />
                              <CommandEmpty>No Country found.</CommandEmpty>
                              <CommandGroup className="max-h-96 overflow-auto">
                                {countries.map((country, index) => (
                                  <CommandItem
                                    value={country.name}
                                    key={index}
                                    onSelect={() => {
                                      form.setValue("country", country.name);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        country.name === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {country.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>
                            Address Line 1{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="addressLine1"
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
                          <FormLabel>
                            Address Line 2{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="addressLine2"
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
                            <Input placeholder="City" type="text" {...field} />
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
                            state
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="state" type="text" {...field} />
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
                            zip code
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Post code"
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
                <CardTitle>Profile Photo</CardTitle>
              </CardHeader>
              <CardContent>
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
                    {item.photo && (
                      <li>
                        <Image
                          src={item.photo}
                          alt={item.photo}
                          width={100}
                          height={100}
                          className="h-full w-full object-contain rounded-md"
                        />
                      </li>
                    )}
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

              <div className="flex justify-center">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-5">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>User Status</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="flex justify-evenly">
                <Button disabled={loading} className="bg-black" type="submit">
                  Save
                </Button>
              </CardFooter>
            </Card>
          )}
        </form>
      </Form>
    </>
  );
};
