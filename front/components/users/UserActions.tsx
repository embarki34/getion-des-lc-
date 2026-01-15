"use client";

import { useState } from "react";
import { User } from "@/lib/types/models";
import { MoreHorizontal, Pencil, Trash, Eye, Lock } from "lucide-react";
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
import { ResetPasswordDialog } from "@/components/dialogs/ResetPasswordDialog";
import { useTranslations } from "next-intl";

import { ConfirmDeleteDialog } from "@/components/dialogs/ConfirmDeleteDialog";
import { UsersService } from "@/lib/services/users.service";
import { toast } from "sonner";

interface UserActionsProps {
    user: User;
    commonT: any;
    onDeleteSuccess?: () => void;
}

export function UserActions({ user, commonT, onDeleteSuccess }: UserActionsProps) {
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const t = useTranslations("Users");

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await UsersService.deleteUser(user.id);
            toast.success(commonT("delete_success") || "User deleted successfully");
            setShowDeleteConfirm(false);
            if (onDeleteSuccess) {
                onDeleteSuccess();
            } else {
                // Fallback if no callback provided
                window.location.reload();
            }
        } catch (error: any) {
            console.error("Delete user error:", error);
            toast.error(error.message || "Failed to delete user");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{commonT("actions")}</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(user.email)}
                    >
                        {commonT("copied", { label: "Email" }).split(" ")[0]}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/users/${user.id}`}
                            className="flex items-center cursor-pointer"
                        >
                            <Eye className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                            {commonT("view")}
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/users/${user.id}/edit`}
                            className="flex items-center cursor-pointer"
                        >
                            <Pencil className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                            {commonT("edit")}
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setShowResetPassword(true)}
                        className="cursor-pointer"
                    >
                        <Lock className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        {t("reset_password") || "Reset Password"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <Trash className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />{" "}
                        {commonT("delete")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ResetPasswordDialog
                open={showResetPassword}
                onOpenChange={setShowResetPassword}
                user={user}
            />

            <ConfirmDeleteDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title={t("delete_confirm_title") || "Delete User"}
                description={t("delete_confirm_desc", { name: user.name }) || `Are you sure you want to delete ${user.name}? This action cannot be undone.`}
            />
        </>
    );
}
