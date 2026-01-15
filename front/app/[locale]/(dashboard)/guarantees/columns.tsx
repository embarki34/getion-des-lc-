"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Guarantee } from "@/lib/types/models";
import {
  MoreHorizontal,
  ArrowUpDown,
  Pencil,
  Trash,
  Eye,
  FileBadge,
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
): ColumnDef<Guarantee>[] => [
    {
      accessorKey: "type",
      header: commonT("type"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileBadge className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{row.getValue("type")}</span>
        </div>
      ),
    },
    {
      accessorKey: "montant",
      header: commonT("amount"),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("montant"));
        const formatted = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "DZD",
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "creditLineId",
      header: "Ligne de Crédit",
      cell: ({ row }) => {
        const id = row.original.creditLineId;
        const no = row.original.creditLineNo || id;
        return (
          <Link
            href={`/credit-lines/${id}`}
            className="text-blue-600 hover:underline font-medium"
          >
            {no}
          </Link>
        );
      },
    },
    {
      accessorKey: "dateExpiration",
      header: commonT("date"),
      cell: ({ row }) => {
        const value = row.getValue("dateExpiration");
        if (!value) return "-";
        const date = new Date(value as string | Date);
        return date.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-FR");
      },
    },
    {
      accessorKey: "status",
      header: commonT("status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "default" | "destructive" | "secondary" | "outline" = "secondary";

        switch (status) {
          case "ACTIVE":
          case "OUVERT":
            variant = "default";
            break;
          case "EXPIRED":
          case "CLOTURE":
          case "SUSPENDU":
            variant = "destructive";
            break;
          case "RELEASED":
          case "UTILISÉ":
          case "EXPÉDIÉ":
            variant = "secondary";
            break;
          default:
            variant = "outline";
        }

        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const guarantee = row.original;

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
                  href={`/guarantees/${guarantee.id}`}
                  className="flex items-center cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                  {commonT("view")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/guarantees/${guarantee.id}/edit`}
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
