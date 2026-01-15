"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "@/lib/types/models";
import { MoreHorizontal, ArrowUpDown, Pencil, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";

export const getColumns = (
  t: any,
  commonT: any,
  companiesT: any,
  onDelete?: (id: string, name: string) => void
): ColumnDef<Supplier>[] => [
    {
      accessorKey: "code",
      header: commonT("code"),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {commonT("name")}
            <ArrowUpDown className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
          </Button>
        );
      },
    },
    {
      accessorKey: "contactInfo",
      header: commonT("contact"),
    },
    {
      accessorKey: "address",
      header: commonT("address"),
    },
    {
      accessorKey: "companiesCount",
      header: companiesT("title"),
    },
    {
      accessorKey: "description",
      header: commonT("description"),
    },
    {
      accessorKey: "isActive",
      header: commonT("status"),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? commonT("active") : commonT("inactive")}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const supplier = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{commonT("actions")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(supplier.code)}
              >
                {commonT("copied", { label: commonT("code") }).split(" ")[0]}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/suppliers/${supplier.id}`}
                  className="flex items-center cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                  {commonT("view")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/suppliers/${supplier.id}/edit`}
                  className="flex items-center cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                  {commonT("edit")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => onDelete?.(supplier.id, supplier.name)}
              >
                <Trash className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                {commonT("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
