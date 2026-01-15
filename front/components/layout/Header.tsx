"use client";

import * as React from "react";
import { Search, LogOut, Languages, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { authApi } from "@/lib/api/auth";
import { useRouter, usePathname } from "@/i18n/routing";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { UsersService } from "@/lib/services/users.service";
import { ChangePasswordDialog } from "@/components/dialogs/ChangePasswordDialog";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [showChangePassword, setShowChangePassword] = React.useState(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await UsersService.getMe();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Call logout API to clear server-side cookie
      await authApi.logout();

      toast.success(t("Auth.logoutSuccess") || "Logged out successfully");

      // Redirect to login page
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t("Auth.logoutFailed") || "Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleLanguage = () => {
    const nextLocale = locale === "fr" ? "ar" : "fr";
    router.replace(pathname, { locale: nextLocale });
  };

  const userInitials = user?.name
    ? user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "JD";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Common.search")}
              className="w-full bg-background pl-9 md:w-[300px] lg:w-[300px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            title={locale === "fr" ? "العربية" : "Français"}
          >
            <Languages className="h-5 w-5" />
          </Button>

          <ModeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatarUrl || "/images/avatar.png"} alt={user?.name || "User"} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "Loading..."}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t("Header.profile")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowChangePassword(true)}>
                <KeyRound className="mr-2 h-4 w-4" />
                {t("Auth.change_password") || "Change Password"}
              </DropdownMenuItem>
              <DropdownMenuItem>{t("Sidebar.settings")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 cursor-pointer"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? t("Auth.loggingOut") : t("Auth.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ChangePasswordDialog
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
      />
    </>
  );
}
