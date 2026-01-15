"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Engagement } from "@/lib/types/models";
import {
  MoreHorizontal,
  ArrowUpDown,
  Pencil,
  Trash,
  Eye,
  FileCheck,
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
  locale: string
): ColumnDef<Engagement>[] => [
  {
    accessorKey: "type",
    header: commonT("type"),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileCheck className="h-4 w-4 text-green-500" />
        <span className="font-medium">{row.getValue("type")}</span>
      </div>
    ),
  },
  {
    accessorKey: "beneficiary",
    header: t("beneficiary") || "Bénéficiaire",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {commonT("amount")}
          <ArrowUpDown className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat(
        locale === "ar" ? "ar-DZ" : "fr-FR",
        {
          style: "currency",
          currency: row.original.currency,
        }
      ).format(amount);
      return <div className="font-mono">{formatted}</div>;
    },
  },
  {
    accessorKey: "issueDate",
    header: commonT("date"),
    cell: ({ row }) => {
      const date = row.getValue("issueDate") as Date;
      return date.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-FR");
    },
  },
  {
    accessorKey: "expiryDate",
    header: commonT("date"),
    cell: ({ row }) => {
      const date = row.getValue("expiryDate") as Date;
      return date.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-FR");
    },
  },
  {
    accessorKey: "status",
    header: commonT("status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "ACTIVE"
          ? "default"
          : status === "PENDING"
          ? "secondary"
          : "outline";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const engagement = row.original;

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
                href={`/engagements/${engagement.id}`}
                className="flex items-center cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                {commonT("view")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/engagements/${engagement.id}/edit`}
                className="flex items-center cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                {commonT("edit")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
              <Trash className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
              {commonT("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
