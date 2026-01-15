"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Document } from "@/lib/types/models";
import {
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Download,
  Trash,
  FileText,
  File,
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

const getFileIcon = (type: string) => {
  if (type.includes("pdf"))
    return <FileText className="h-4 w-4 text-red-500" />;
  if (type.includes("image")) return <File className="h-4 w-4 text-blue-500" />;
  if (type.includes("text") || type.includes("doc"))
    return <FileText className="h-4 w-4 text-blue-600" />;
  return <File className="h-4 w-4 text-gray-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export const getColumns = (
  t: any,
  commonT: any,
  locale: string
): ColumnDef<Document>[] => [
  {
    accessorKey: "name",
    header: commonT("name"),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {getFileIcon(row.original.type)}
        <span className="font-medium">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "entityType",
    header: commonT("type"),
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("entityType")}</Badge>
    ),
  },
  {
    accessorKey: "size",
    header: t("size") || "Size",
    cell: ({ row }) => formatFileSize(row.getValue("size")),
  },
  {
    accessorKey: "uploadedBy",
    header: t("uploadedBy") || "Uploaded By",
  },
  {
    accessorKey: "uploadDate",
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
      const date = row.getValue("uploadDate") as Date;
      return date.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-FR");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const doc = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{commonT("actions")}</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
              {commonT("view")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
              {t("download") || "Download"}
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
