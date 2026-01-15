"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BusinessUnit } from "@/lib/types/models";
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
  usersT: any,
  suppliersT: any,
  onDelete?: (id: string, name: string) => void
): ColumnDef<BusinessUnit>[] => [
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
      accessorKey: "companyName",
      header: t("company"),
      cell: ({ row }) => {
        const bu = row.original;
        return (
          <Link
            href={`/companies/${bu.companyId}`}
            className="hover:underline text-blue-600"
          >
            {bu.companyName}
          </Link>
        );
      },
    },
    {
      accessorKey: "usersCount",
      header: usersT("title"),
    },
    {
      accessorKey: "suppliersCount",
      header: suppliersT("title"),
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
        const bu = row.original;

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
                onClick={() => navigator.clipboard.writeText(bu.code)}
              >
                {commonT("copied", { label: commonT("code") }).split(" ")[0]}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/business-units/${bu.id}`}
                  className="flex items-center cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                  {commonT("view")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/business-units/${bu.id}/edit`}
                  className="flex items-center cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                  {commonT("edit")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => onDelete?.(bu.id, bu.name)}
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
