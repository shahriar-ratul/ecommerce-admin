"use client";
import * as z from "zod";
import { useCallback, useEffect, useState } from "react";
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

import { type FileRejection, useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
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
import { BackendUrl } from "@/constants/data";
import {
  ArrowUpIcon,
  CalendarIcon,
  CheckCircle2Icon,
  MessageCircleWarningIcon,
  X
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import MultipleSelector, {
  type Option
} from "@/components/ui/multiple-selector";
import { Modal } from "@/components/ui/modal";

const statuses = [
  {
    label: "Active",
    value: "Active"
  },
  {
    label: "Inactive",
    value: "Inactive"
  }
];

export const CreateProductForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isNewRoute, setIsNewRoute] = useState(false);
  const [isNewSource, setIsNewSource] = useState(false);
  const [isNewPlatform, setIsNewPlatform] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [routeName, setRouteName] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [platformName, setPlatformName] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<any[]>([]);

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

  const [multipleFiles, setMultipleFiles] = useState<
    (File & { preview: string })[]
  >([]);
  const [multipleRejected, setMultipleRejected] = useState<FileRejection[]>([]);

  const onMultipleDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles?.length) {
        setMultipleFiles(previousFiles => [
          ...previousFiles,
          ...acceptedFiles.map(file =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          )
        ]);
      }

      if (rejectedFiles?.length) {
        setMultipleRejected(previousFiles => [
          ...previousFiles,
          ...rejectedFiles
        ]);
      }
    },
    []
  );

  const {
    getRootProps: getMultipleRootProps,
    getInputProps: getMultipleInputProps,
    isDragActive: isMultipleDragActive
  } = useDropzone({
    maxFiles: 10,
    multiple: true,
    accept: {
      "image/*": []
    },
    maxSize: 1024 * 2048,
    onDrop: onMultipleDrop
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () =>
      multipleFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }, [multipleFiles]);

  const removeMultipleFile = (name: string) => {
    setMultipleFiles(files => files.filter(file => file.name !== name));
  };

  const removeMultipleAll = () => {
    setMultipleFiles([]);
    setMultipleRejected([]);
  };

  const removeMultipleRejected = (name: string) => {
    setMultipleRejected(files =>
      files.filter(({ file }) => file.name !== name)
    );
  };

  const formSchema = z.object({
    entryDate: z.date({
      required_error: "A date of birth is required."
    }),
    batch: z.string().min(1, { message: "Batch is required" }),
    name: z.string().min(1, { message: "name is required" }),
    productId: z.string().min(1, { message: "Product is required" }),

    category: z.string(),
    source: z.string(),
    qty: z.string().min(1, { message: "Qty is required" }),
    costPerUnit: z.string().min(1, { message: "Cost Per Unit is required" }),
    localShippingCost: z
      .string()
      .min(1, { message: "Local Shipping Cost is required" }),
    internationalShippingCost: z
      .string()
      .min(1, { message: "International Shipping Cost is required" }),
    customsTax: z.string().min(1, { message: "customsTax is required" }),
    salePrice: z.string().min(1, { message: "salePrice is required" }),
    marketPrice: z.string().min(1, { message: "marketPrice is required" }),
    partnerPrice: z.string().min(1, { message: "partnerPrice is required" }),

    platforms: z
      .array(
        z.object({
          label: z.string(),
          value: z.number()
        })
      )
      .min(1, { message: "platform is required" }),
    route: z.string().min(1, { message: "route is required" }),
    trackingStatus: z
      .string()
      .min(1, { message: "trackingStatus is required" }),
    trackingNumberLocal: z
      .string()
      .min(1, { message: "trackingNumberLocal is required" }),
    trackingNumberInternational: z
      .string()
      .min(1, { message: "trackingNumberInternational is required" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    isActive: z.boolean().default(false)
  });

  type FormValues = z.infer<typeof formSchema>;

  const defaultValues = {
    entryDate: undefined,
    name: "",
    batch: "",
    productId: "",
    category: "",
    source: "",
    qty: "",
    costPerUnit: "",
    localShippingCost: "",
    internationalShippingCost: "",
    customsTax: "",
    salePrice: "",
    marketPrice: "",
    partnerPrice: "",
    platform: "",
    route: "",
    trackingStatus: "",
    trackingNumberLocal: "",
    trackingNumberInternational: "",
    email: "",
    isActive: true
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const getRoutes = async () => {
    const { data } = await axios.get(`${BackendUrl}/api/v1/common/all-routes`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data?.user.accessToken}`
      }
    });

    if (data.success) {
      setRoutes(data.data.items as any[]);
    }
  };

  const getCategories = async () => {
    const { data } = await axios.get(
      `${BackendUrl}/api/v1/common/all-categories`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.user.accessToken}`
        }
      }
    );

    if (data.success) {
      setCategories(data.data.items as any[]);
    }
  };

  const getSources = async () => {
    const { data } = await axios.get(
      `${BackendUrl}/api/v1/common/all-sources`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.user.accessToken}`
        }
      }
    );
    if (data.success) {
      setSources(data.data.items as any[]);
    }
  };

  const getPlatforms = async () => {
    const { data } = await axios.get(
      `${BackendUrl}/api/v1/common/all-platforms`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.user.accessToken}`
        }
      }
    );
    if (data.success) {
      if (data.data.items.length > 0) {
        const items = data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setPlatforms(items as any[]);
      }
    }
  };

  useEffect(() => {
    getCategories();
    getRoutes();
    getSources();
    getPlatforms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitCategory = async () => {
    try {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${session.data?.user.accessToken}`;

      await axios
        .post(
          `${BackendUrl}/api/v1/categories`,
          {
            name: categoryName
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          const message =
            (res.data.data.message as string) || "created successfully";

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

          setIsNewCategory(false);
          getCategories();
          setCategoryName("");
          form.setValue("category", "");
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
    }
  };

  const onSubmitSource = async () => {
    try {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${session.data?.user.accessToken}`;

      await axios
        .post(
          `${BackendUrl}/api/v1/sources`,
          {
            name: sourceName
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          const message =
            (res.data.data.message as string) || "created successfully";

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

          setCategoryName("");
          setIsNewSource(false);
          getSources();
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
    }
  };

  const onSubmitRoute = async () => {
    try {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${session.data?.user.accessToken}`;

      await axios
        .post(
          `${BackendUrl}/api/v1/routes`,
          {
            name: routeName
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          const message =
            (res.data.data.message as string) || "created successfully";

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

          setRouteName("");
          setIsNewRoute(false);
          getRoutes();
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
    }
  };

  const onSubmitPlatform = async () => {
    try {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${session.data?.user.accessToken}`;

      await axios
        .post(
          `${BackendUrl}/api/v1/platforms`,
          {
            name: platformName
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          const message =
            (res.data.data.message as string) || "created successfully";

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

          setPlatformName("");
          setIsNewPlatform(false);
          getPlatforms();
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
    }
  };
  const onSubmit = async (data: FormValues) => {
    try {
      const {
        entryDate,
        batch,
        productId,
        category,
        source,
        qty,
        costPerUnit,
        localShippingCost,
        internationalShippingCost,
        customsTax,
        salePrice,
        marketPrice,
        partnerPrice,
        platforms,
        route,
        trackingStatus,
        trackingNumberLocal,
        trackingNumberInternational,
        email,
        isActive,
        name
      } = data;

      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("batch", batch);
      formData.append("productId", productId);
      formData.append("email", email);
      formData.append("category", category);
      formData.append("source", source);
      formData.append("qty", qty);
      formData.append("costPerUnit", costPerUnit);
      formData.append("localShippingCost", localShippingCost);
      formData.append("internationalShippingCost", internationalShippingCost);
      formData.append("customsTax", customsTax);
      formData.append("salePrice", salePrice);
      formData.append("marketPrice", marketPrice);
      formData.append("partnerPrice", partnerPrice);
      formData.append("route", route);
      formData.append("trackingStatus", trackingStatus);
      formData.append("trackingNumberLocal", trackingNumberLocal);
      formData.append(
        "trackingNumberInternational",
        trackingNumberInternational
      );

      formData.append("isActive", String(isActive));

      const platformsValue = platforms.map(item => item.value);

      formData.append("platforms", JSON.stringify(platformsValue));

      if (entryDate) {
        formData.append("entryDate", JSON.stringify(entryDate));
      }

      if (files?.length > 0) {
        formData.append("image", files[0]);
      }

      if (multipleFiles && multipleFiles.length > 0) {
        multipleFiles.forEach(file => {
          formData.append("files", file);
        });
      }

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${session.data?.user.accessToken}`;

      await axios
        .post(`${BackendUrl}/api/v1/stocks`, formData, {
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
          router.push("/stocks");
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
      <Modal
        title="Add New Category"
        description=""
        isOpen={isNewCategory}
        onClose={() => setIsNewCategory(false)}
      >
        <div>
          <Input
            placeholder="Category"
            className="w-full"
            onChange={e => setCategoryName(e.target.value)}
          />
        </div>

        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button
            disabled={loading}
            variant="outline"
            onClick={() => setIsNewCategory(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            variant="destructive"
            onClick={onSubmitCategory}
          >
            Add
          </Button>
        </div>
      </Modal>
      <Modal
        title="Add New Source"
        description=""
        isOpen={isNewSource}
        onClose={() => setIsNewSource(false)}
      >
        <div>
          <Input
            placeholder="source"
            className="w-full"
            onChange={e => setSourceName(e.target.value)}
          />
        </div>

        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button
            disabled={loading}
            variant="outline"
            onClick={() => setIsNewSource(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            variant="destructive"
            onClick={onSubmitSource}
          >
            Add
          </Button>
        </div>
      </Modal>
      <Modal
        title="Add New Route"
        description=""
        isOpen={isNewRoute}
        onClose={() => setIsNewRoute(false)}
      >
        <div>
          <Input
            placeholder="Route"
            className="w-full"
            onChange={e => setRouteName(e.target.value)}
          />
        </div>

        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button
            disabled={loading}
            variant="outline"
            onClick={() => setIsNewRoute(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            variant="destructive"
            onClick={onSubmitRoute}
          >
            Add
          </Button>
        </div>
      </Modal>
      <Modal
        title="Add New Platform"
        description=""
        isOpen={isNewPlatform}
        onClose={() => setIsNewPlatform(false)}
      >
        <div>
          <Input
            placeholder="platform"
            className="w-full"
            onChange={e => setPlatformName(e.target.value)}
          />
        </div>

        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button
            disabled={loading}
            variant="outline"
            onClick={() => setIsNewPlatform(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            variant="destructive"
            onClick={onSubmitPlatform}
          >
            Add
          </Button>
        </div>
      </Modal>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="md:grid md:grid-cols-2 gap-8">
                {/* entryDate */}
                <FormField
                  control={form.control}
                  name="entryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col p-2">
                      <FormLabel>Entry Date</FormLabel>
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
                              date > new Date() || date < new Date("1970-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* batch */}
                <FormField
                  control={form.control}
                  name="batch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="batch"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* productId */}
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ProductId</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="productId"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category &nbsp;
                        <Button
                          variant="link"
                          onClick={e => {
                            e.preventDefault();
                            setIsNewCategory(true);
                          }}
                        >
                          New Category
                        </Button>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat, index) => (
                            <SelectItem key={index} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* qty */}
                <FormField
                  control={form.control}
                  name="qty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          {...field}
                          placeholder="qty"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* costPerUnit */}
                <FormField
                  control={form.control}
                  name="costPerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>costPerUnit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          {...field}
                          placeholder="costPerUnit"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* localShippingCost */}
                <FormField
                  control={form.control}
                  name="localShippingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>localShippingCost</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          {...field}
                          placeholder="localShippingCost"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* internationalShippingCost */}
                <FormField
                  control={form.control}
                  name="internationalShippingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>internationalShippingCost</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          {...field}
                          placeholder="internationalShippingCost"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* customsTax */}
                <FormField
                  control={form.control}
                  name="customsTax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>customsTax</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          {...field}
                          placeholder="customsTax"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* salePrice */}
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>salePrice</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          {...field}
                          placeholder="salePrice"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* marketPrice */}
                <FormField
                  control={form.control}
                  name="marketPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>marketPrice</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          {...field}
                          placeholder="marketPrice"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* partnerPrice */}
                <FormField
                  control={form.control}
                  name="partnerPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>partnerPrice</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          {...field}
                          placeholder="partnerPrice"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Source{" "}
                        <Button
                          variant="link"
                          onClick={e => {
                            e.preventDefault();
                            setIsNewSource(true);
                          }}
                        >
                          New Source
                        </Button>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sources.map((source, index) => (
                            <SelectItem
                              key={index}
                              value={source.id.toString()}
                            >
                              {source.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="platforms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Platforms &nbsp;{" "}
                        <Button
                          variant="link"
                          onClick={e => {
                            e.preventDefault();
                            setIsNewPlatform(true);
                          }}
                        >
                          New Platform
                        </Button>
                      </FormLabel>
                      <FormControl>
                        <MultipleSelector
                          value={field.value as unknown as Option[]}
                          onChange={field.onChange}
                          options={platforms}
                          defaultOptions={platforms}
                          placeholder="Select platforms"
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

                <FormField
                  control={form.control}
                  name="route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Route &nbsp;{" "}
                        <Button
                          variant="link"
                          onClick={e => {
                            e.preventDefault();
                            setIsNewRoute(true);
                          }}
                        >
                          New Route
                        </Button>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a route" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {routes.length > 0 &&
                            routes.map((route, index) => (
                              <SelectItem
                                key={index}
                                value={route.id.toString()}
                              >
                                {route.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="trackingStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tracking Status </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statuses.map((status, index) => (
                            <SelectItem key={index} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trackingNumberLocal"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>
                          trackingNumberLocal{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="trackingNumberLocal"
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
                  name="trackingNumberInternational"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>
                          trackingNumberInternational
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="trackingNumberInternational"
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
                        <FormLabel>
                          Email
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle>Cover Photo</CardTitle>
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

            <CardHeader>
              <CardTitle>Multiple Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getMultipleRootProps({
                  className:
                    "p-16 mt-10 border border-4 border-black rounded-md p-16 mt-10"
                })}
              >
                <input {...getMultipleInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4">
                  <ArrowUpIcon className="w-5 h-5 fill-current" />
                  {isMultipleDragActive ? (
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
                    onClick={removeMultipleAll}
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
                  {multipleFiles.map(file => (
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
                        onClick={() => removeMultipleFile(file.name)}
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
                  {multipleRejected.map(({ file, errors }) => (
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
                        onClick={() => removeMultipleRejected(file.name)}
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
                      <FormLabel>Status</FormLabel>
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
        </form>
      </Form>
    </>
  );
};
