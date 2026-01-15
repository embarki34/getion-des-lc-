"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/lib/types/models";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserActions } from "@/components/users/UserActions";

import { UserStatusToggle } from "@/components/users/UserStatusToggle";

export const getColumns = (
  t: any,
  commonT: any,
  locale: string,
  onDataChanged?: () => void
): ColumnDef<User>[] => [
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
        const user = row.original;
        const initials = user.name
          .split(" ")
          .map((n) => n[0])
          .join("");
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: t("role"),
      cell: ({ row }) => <Badge variant="outline">{row.getValue("role")}</Badge>,
    },
    {
      accessorKey: "status",
      header: commonT("status"),
      cell: ({ row }) => (
        <UserStatusToggle
          user={row.original}
          onStatusChange={onDataChanged}
        />
      ),
    },
    {
      accessorKey: "lastLogin",
      header: commonT("date"),
      cell: ({ row }) => {
        const date = row.getValue("lastLogin") as Date;
        return date
          ? date.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-FR")
          : "-";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <UserActions user={row.original} commonT={commonT} onDeleteSuccess={onDataChanged} />,
    },
  ];
