"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Banque } from "@/lib/types/models";
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
import { Link } from "@/i18n/routing";

export const getColumns = (
  t: any,
  router: any,
  onDelete: (bank: Banque) => Promise<void>
): ColumnDef<any>[] => [
    {
      accessorKey: "codeSwift",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("codeSwift")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "nom",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("nom")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "codeGuichet",
      header: t("codeGuichet"),
      cell: ({ row }) => {
        const codeGuichet = row.getValue("codeGuichet");
        return codeGuichet ? (
          <span>{codeGuichet as string}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "establishment",
      header: t("establishment"),
    },
    {
      accessorKey: "adresse",
      header: t("adresse"),
    },
    {
      accessorKey: "contactInfo",
      header: t("contact"),
      cell: ({ row }) => {
        const contactInfo = row.getValue("contactInfo");
        return contactInfo ? (
          <span>{contactInfo as string}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "bankAccounts",
      header: t("numAccounts"),
      cell: ({ row }) => {
        const bankAccounts = row.getValue("bankAccounts") as any[];
        return <span>{bankAccounts?.length || 0}</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const bank = row.original;

        const handleDelete = async () => {
          await onDelete(bank);
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
              <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(bank.codeSwift)}
              >
                {t("copySwift")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/banks/${bank.id}`}
                  className="flex items-center cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" /> {t("viewDetails")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/banks/${bank.id}/edit`}
                  className="flex items-center cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" /> {t("edit")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={handleDelete}
              >
                <Trash className="mr-2 h-4 w-4" /> {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
