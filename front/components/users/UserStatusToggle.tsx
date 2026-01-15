"use client";

import { useState } from "react";
import { User } from "@/lib/types/models";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { UsersService } from "@/lib/services/users.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UserStatusToggleProps {
    user: User;
    onStatusChange?: () => void;
}

export function UserStatusToggle({ user, onStatusChange }: UserStatusToggleProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Determine if active. Note: user.status comes from API which might be uppercase 'ACTIVE' or lowercase 'active'.
    const isActive = user.status?.toUpperCase() === "ACTIVE";
    const isPending = user.status?.toUpperCase() === "PENDING";

    const handleToggle = async (checked: boolean) => {
        try {
            setIsLoading(true);
            const newStatus = checked ? "active" : "suspended"; // Use lowercase for backend

            await UsersService.updateUser(user.id, {
                status: newStatus,
                // We only send status. Backend handles the transition.
            });

            toast.success(`User ${checked ? "activated" : "suspended"} successfully`);

            if (onStatusChange) {
                onStatusChange();
            }
        } catch (error: any) {
            console.error("Error updating status:", error);
            toast.error(error.message || "Failed to update status");
        } finally {
            setIsLoading(false);
        }
    };

    if (isPending) {
        // For pending users, maybe don't show toggle? Or allow activating? 
        // Usually Pending requires email verification or manual approval.
        // Let's allow toggle to Activate if that's desired, or keep as Badge if we want to restrict.
        // User request was general. Let's show badge for Pending to be safe, or allow activate.
        // Let's stick to Badge for Pending to avoid accidental activation of unverified emails, OR allow it.
        // I'll return Badge for PENDING for now.
        return <Badge variant="secondary">PENDING</Badge>;
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch
                checked={isActive}
                onCheckedChange={handleToggle}
                disabled={isLoading}
            />
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <span className="text-sm text-muted-foreground">
                {isActive ? "Active" : "Suspended"}
            </span>
        </div>
    );
}
