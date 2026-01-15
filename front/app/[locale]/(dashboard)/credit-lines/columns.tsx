"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CreditLine } from "@/lib/types/models";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import { CreditLinesService } from "@/lib/services/credit-lines.service";

export const getColumns = (
  t: any,
  commonT: any,
  locale: string,
  onDelete: (item: CreditLine) => Promise<void>
): ColumnDef<CreditLine>[] => [
    {
      accessorKey: "no",
      header: commonT("code"),
      cell: ({ row }) => (
        <div className="font-mono">
          {row.getValue("no") || row.original.noSeries || "-"}
        </div>
      ),
    },
    {
      accessorKey: "banqueId",
      header: t("bank"),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("banqueId")}</div>
      ),
    },
    {
      accessorKey: "typeFinancement",
      header: commonT("type"),
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("typeFinancement")}</Badge>
      ),
    },
    {
      accessorKey: "montantPlafond",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("limit")}
            <ArrowUpDown className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("montantPlafond"));
        const currency = row.original.montantDevise || "DZD";
        const formatted = new Intl.NumberFormat(
          locale === "ar" ? "ar-DZ" : "fr-FR",
          {
            style: "currency",
            currency: currency,
          }
        ).format(amount);
        return (
          <div className="font-mono font-medium text-right rtl:text-left">
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "statut",
      header: commonT("status"),
      cell: ({ row }) => {
        const status = row.getValue("statut") as string;
        return (
          <Badge
            variant={
              status === "OUVERT"
                ? "default"
                : status === "CLOTURÉ"
                  ? "destructive"
                  : "secondary"
            }
            className={
              status === "OUVERT" ? "bg-green-600 hover:bg-green-700" : ""
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "expiryDate",
      header: t("expiryDate"),
      cell: ({ row }) => {
        const date = new Date(row.getValue("expiryDate"));
        return (
          <div>
            {date.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-FR")}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const creditLine = row.original;

        const handleDelete = async () => {
          await onDelete(creditLine);
        };

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
                onClick={() => {
                  navigator.clipboard.writeText(creditLine.id);
                  toast.success(commonT("copied", { label: "ID" }));
                }}
              >
                <Copy className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                {commonT("copied", { label: "ID" }).split(" ")[0]}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/credit-lines/${creditLine.id}`}>
                  <div className="flex items-center w-full">
                    <Eye className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                    {commonT("view")}
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/credit-lines/${creditLine.id}/edit`}>
                  <div className="flex items-center w-full">
                    <Pencil className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                    {commonT("edit")}
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                <Trash className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                {commonT("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
