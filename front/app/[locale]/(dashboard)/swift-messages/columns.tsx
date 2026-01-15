"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SwiftMessage } from "@/lib/types/models";
import {
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Download,
  MessageSquare,
  ArrowDownToLine,
  ArrowUpFromLine,
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
): ColumnDef<SwiftMessage>[] => [
  {
    accessorKey: "reference",
    header: commonT("code"),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-blue-500" />
        <span className="font-mono text-sm">{row.getValue("reference")}</span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: commonT("type"),
    cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
  },
  {
    accessorKey: "direction",
    header: commonT("type"),
    cell: ({ row }) => {
      const direction = row.getValue("direction") as string;
      const isIncoming = direction === "INCOMING";
      return (
        <div className="flex items-center gap-2">
          {isIncoming ? (
            <ArrowDownToLine className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowUpFromLine className="h-4 w-4 text-orange-500" />
          )}
          <span>
            {isIncoming
              ? t("incoming") || direction
              : t("outgoing") || direction}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "bankId",
    header: t("bank") || commonT("bank"),
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {commonT("date")}
          <ArrowUpDown className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;
      return date.toLocaleString(locale === "ar" ? "ar-DZ" : "fr-FR");
    },
  },
  {
    accessorKey: "status",
    header: commonT("status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "PROCESSED"
          ? "default"
          : status === "PENDING"
          ? "secondary"
          : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const message = row.original;

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
                href={`/swift-messages/${message.id}`}
                className="flex items-center cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                {commonT("view")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
              {commonT("export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
