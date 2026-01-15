"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { UsersService } from "@/lib/services/users.service";
import { Loader2, ArrowLeft, Mail, Shield, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const locale = useLocale();

    const commonT = useTranslations("Common");
    const usersT = useTranslations("Users");

    const [user, setUser] = React.useState<any | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const userData = await UsersService.getUserById(id);
                setUser(userData);
            } catch (err) {
                console.error("Error fetching user details:", err);
                setError(err instanceof Error ? err.message : "Failed to load user details");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex bg-background h-full flex-col items-center justify-center space-y-4 p-8">
                <p className="text-destructive">{error || "User not found"}</p>
                <Link href="/users">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        {commonT("back")}
                    </Button>
                </Link>
            </div>
        );
    }

    const initials = user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("");

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center space-x-4">
                <Link href="/users">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>{usersT("role")}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="outline" className="text-sm">
                            {user.role}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Mail className="h-5 w-5" />
                            <span>{commonT("status")}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge
                            variant={
                                user.status === "ACTIVE"
                                    ? "default"
                                    : user.status === "PENDING"
                                        ? "secondary"
                                        : "destructive"
                            }
                        >
                            {user.status}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            {user.emailVerified ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span>Email Verification</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">
                            {user.emailVerified ? "Verified" : "Not Verified"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-muted-foreground">
                                <Calendar className="inline mr-2 h-4 w-4" />
                                Created At:
                            </span>
                            <span>
                                {user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString(
                                        locale === "ar" ? "ar-DZ" : "fr-FR"
                                    )
                                    : "-"}
                            </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-muted-foreground">
                                <Calendar className="inline mr-2 h-4 w-4" />
                                Last Login:
                            </span>
                            <span>
                                {user.lastLogin
                                    ? new Date(user.lastLogin).toLocaleDateString(
                                        locale === "ar" ? "ar-DZ" : "fr-FR"
                                    )
                                    : "Never"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex space-x-2">
                <Link href={`/users/${id}/edit`}>
                    <Button>Edit User</Button>
                </Link>
                <Button variant="destructive">Delete User</Button>
            </div>
        </div>
    );
}
