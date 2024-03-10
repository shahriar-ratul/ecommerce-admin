"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  type PaginationState
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from "@radix-ui/react-icons";
import Loader from "@/components/loader/loader";
import { type AdminModel } from "@/schema/AdminSchema";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { AlertModal } from "@/components/modal/alert-modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";

export default function AdminTable() {
  const [tableData, setTableData] = useState<AdminModel[]>([]);

  const [selectedRow, setSelectedRow] = useState<AdminModel | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const session = useSession();

  const router = useRouter();

  // Search param
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const [search, setSearch] = useState("");
  const [searchKey] = useDebounce(search, 500);

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize: limit ?? 10
  });

  const onConfirm = async () => {
    setLoading(true);
    setOpen(false);

    axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    axios.defaults.headers.common["Authorization"] =
      `Bearer ${session.data?.user.accessToken}`;

    if (actionType === "changeStatus") {
      try {
        const { data } = await axios.put(
          `/api/v1/admins/status/${selectedRow?.id}`
        );

        if (data) {
          toast.success(`${selectedRow?.username} ${data.data.message}`, {
            style: {
              border: "1px solid #4caf50",
              padding: "16px",
              color: "#4caf50",
              backgroundColor: "#f0f4f7"
            },
            position: "top-right",
            closeButton: true,
            action: {
              label: "Close",
              onClick: () => {
                toast.dismiss();
              }
            }
          });
        }
      } catch (error: any) {
        toast.error(error.response.data.message as string, {
          style: {
            border: "1px solid #FF0000",
            padding: "16px",
            color: "#f0f4f7",
            backgroundColor: "#FF0000"
          },
          position: "top-right",
          closeButton: true,
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            }
          }
        });
      }
    }
    if (actionType === "delete") {
      try {
        const { data } = await axios.delete(
          `/api/v1/admins/${selectedRow?.id}`
        );

        if (data) {
          toast.success(`${selectedRow?.username} ${data.data.message}`, {
            style: {
              border: "1px solid #4caf50",
              padding: "16px",
              color: "#4caf50",
              backgroundColor: "#f0f4f7"
            },
            position: "top-right",
            closeButton: true,
            action: {
              label: "Close",
              onClick: () => {
                toast.dismiss();
              }
            }
          });
        }
      } catch (error: any) {
        toast.error(error.response.data.message as string, {
          style: {
            border: "1px solid #FF0000",
            padding: "16px",
            color: "#f0f4f7",
            backgroundColor: "#FF0000"
          },
          position: "top-right",
          closeButton: true,
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            }
          }
        });
      }
    }
    refetch();

    setLoading(false);
  };

  const columns: ColumnDef<AdminModel>[] = [
    {
      accessorKey: "id",
      header: "Serial No.",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span className="ml-2">{row.index + 1 + pageSize * pageIndex}</span>
          </div>
        );
      }
    },

    {
      accessorKey: "username",
      header: "Username"
    },

    {
      accessorKey: "email",
      header: "Email"
    },
    {
      accessorKey: "phone",
      header: "Phone"
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span className="ml-2 flex justify-center flex-col">
              {row.original.roles.flatMap((role, index) => {
                return (
                  <Badge
                    variant="default"
                    key={index}
                    className="text-center m-1 flex justify-center"
                  >
                    {role.role.name}
                  </Badge>
                );
              })}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span className="ml-2">
              {row.original.isActive ? (
                <Badge variant="success">Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </span>
          </div>
        );
      }
    },

    {
      id: "changeStatus",
      header: "Change Status",
      cell: ({ row }) => (
        <Button
          variant="outline"
          onClick={() => {
            setOpen(true);
            setSelectedRow(row.original);
            setActionType("changeStatus");
          }}
        >
          Change Status
        </Button>
      )
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-10 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-gray-600 text-sm font-normal text-center">
                Actions
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/admin/${row.original.id}`)
                }
              >
                <Tooltip>
                  <TooltipTrigger>
                    <span className="flex">
                      <Edit className="mr-2 h-4 w-4" /> Update
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-blue-500 text-white">
                    <p>Update the details</p>
                  </TooltipContent>
                </Tooltip>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setOpen(true);
                  setSelectedRow(row.original);
                  setActionType("delete");
                }}
              >
                <Tooltip>
                  <TooltipTrigger>
                    <span className="flex ">
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-blue-500 text-white">
                    <p>Update the details</p>
                  </TooltipContent>
                </Tooltip>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    }
  ];

  const table = useReactTable({
    data: tableData as AdminModel[],
    columns: columns as ColumnDef<AdminModel>[],
    pageCount: totalPages ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: { pageIndex, pageSize }
    },
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true
  });

  const fetchData = async (page: number, limit: number, search: string) => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    axios.defaults.headers.common["Authorization"] =
      `Bearer ${session.data?.user.accessToken}`;

    if (page === 0) {
      page = 1;
    }

    const { data } = await axios.get(
      `/api/v1/admins?page=${page}&limit=${limit}&search=${search}`
    );

    // const { data } = await axios.get(
    //   `/api/v1/admins?page=${page}&limit=${limit}&order=${order}&sort=${sort}`
    // );

    return data;
  };

  const { isLoading, isError, error, isFetching, refetch } = useQuery<
    boolean,
    any
  >({
    queryKey: ["admins-list", pageIndex, pageSize, searchKey],
    queryFn: async () => {
      const { data } = await fetchData(
        table.getState().pagination.pageIndex + 1,
        table.getState().pagination.pageSize,
        searchKey
      );

      table.setState({
        ...table.getState(),
        pagination: {
          pageSize: data.meta.limit,
          pageIndex: data.meta.page
        }
      });

      setTotalPages(data.meta.pageCount as number);

      setTableData(data.items as AdminModel[]);
      setPage(data.meta.page as number);
      setLimit(data.meta.limit as number);

      return true;
    }
  });

  useEffect(() => {
    if (tableData) {
      setTableData(tableData);
    }
  }, [tableData]);

  return (
    <>
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {isError ? (
            <div className="text-red-600 text-center font-bold">
              {error?.message}
            </div>
          ) : null}

          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onConfirm}
            loading={loading}
          />

          <Input
            placeholder={`Search ...`}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
            }}
            className="w-full md:max-w-sm border-2 border-purple-500"
          />
          {/* <ScrollArea className="rounded-md border h-[calc(80vh-220px)] "> */}
          <Table className="relative rounded-md border w-full ">
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* <ScrollBar orientation="horizontal" /> */}
          {/* </ScrollArea> */}
          <div className="flex items-center justify-between px-2 w-full overflow-x-auto">
            <div className="flex-1 text-sm text-muted-foreground hidden md:block">
              Showing{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              to {table.getFilteredRowModel().rows.length} rows.
            </div>
            <div className="flex items-center space-x-4 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={value => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map(pageSize => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[100px] items-center justify-center text-sm font-medium hidden sm:flex">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <DoubleArrowLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <DoubleArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
