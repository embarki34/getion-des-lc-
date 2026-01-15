"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Role } from "@/lib/types/models";
import {
  MoreHorizontal,
  ArrowUpDown,
  Pencil,
  Trash,
  Shield,
} from "lucide-react";
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
  onDelete?: (id: string) => void
): ColumnDef<Role>[] => [
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
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: commonT("description"),
    },
    {
      accessorKey: "permissionsCount",
      header: "Permissions",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("permissionsCount")}</Badge>
      ),
    },
    {
      accessorKey: "usersCount",
      header: usersT("title"),
    },
    {
      accessorKey: "active",
      header: commonT("status"),
      cell: ({ row }) => {
        const isActive = row.getValue("active") as boolean;
        return (
          <Badge variant={isActive ? "default" : "outline"}>
            {isActive ? commonT("active") : commonT("inactive")}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const role = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{commonT("actions")}</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link
                  href={`/roles/${role.id}/edit`}
                  className="flex items-center cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                  {commonT("edit")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/roles/${role.id}/permissions`}
                  className="flex items-center cursor-pointer"
                >
                  <Shield className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                  {t("permissions") || "Permissions"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => onDelete?.(role.id)}
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
