"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Company } from "@/lib/types/models";
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
  router: any,
  onDelete: (company: Company) => void
): ColumnDef<Company>[] => [
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "parentCompany",
      header: t("parent"),
      cell: ({ row }) => row.getValue("parentCompany") || "-",
    },
    {
      accessorKey: "businessUnitsCount",
      header: t("bus"),
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
        const company = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{commonT("actions")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(company.code)}
              >
                {t("copyCode")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/companies/${company.id}`}
                  className="flex items-center cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" /> {commonT("view")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/companies/${company.id}/edit`}
                  className="flex items-center cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" /> {commonT("edit")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(company)}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <Trash className="mr-2 h-4 w-4" /> {commonT("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
