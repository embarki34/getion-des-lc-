"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AuditLog } from "@/lib/services/audit.service";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const ActionBadge = ({ action }: { action: string }) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        CREATE: "default",
        UPDATE: "secondary",
        DELETE: "destructive",
    };

    return <Badge variant={variants[action] || "outline"}>{action}</Badge>;
};

const DetailsCell = ({ details }: { details: any }) => {
    if (!details || Object.keys(details).length === 0) return <span className="text-muted-foreground">-</span>;

    // Try to parse if it's a string, though it should be an object
    const cleanDetails = typeof details === 'string' ? JSON.parse(details) : details;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">View Details</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Audit Details</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-auto rounded-md bg-slate-950 p-4 text-xs text-white">
                    <pre className="font-mono whitespace-pre-wrap break-all">
                        {JSON.stringify(cleanDetails, null, 2)}
                    </pre>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export const columns: ColumnDef<AuditLog>[] = [
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            try {
                return <span className="whitespace-nowrap">{format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm:ss")}</span>;
            } catch (e) {
                return <span>{row.original.createdAt}</span>;
            }
        },
    },
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => <ActionBadge action={row.original.action} />,
    },
    {
        accessorKey: "entity",
        header: "Entity",
        cell: ({ row }) => <span className="font-medium">{row.original.entity}</span>,
    },
    {
        accessorKey: "entityId",
        header: "ID",
        cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground" title={row.original.entityId}>{row.original.entityId.substring(0, 8)}...</span>,
    },
    {
        accessorKey: "user.name",
        header: "User",
        cell: ({ row }) => {
            const user = row.original.user;
            return user ? (
                <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
            ) : (
                <span className="text-muted-foreground italic">System</span>
            );
        },
    },
    {
        accessorKey: "ipAddress",
        header: "IP Address",
        cell: ({ row }) => {
            const ip = row.original.ipAddress || "-";
            const cleanIp = ip.replace("::ffff:", "");
            return <span className="font-mono text-xs">{cleanIp}</span>;
        },
    },
    {
        accessorKey: "details",
        header: "Details",
        cell: ({ row }) => <DetailsCell details={row.original.details} />,
    },
];
