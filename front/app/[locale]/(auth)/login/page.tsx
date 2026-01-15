import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { LoginForm } from "@/components/forms/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Auth");

  return (
    <Card className="w-full max-w-[400px] shadow-lg border-zinc-200 dark:border-zinc-800">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          {/* Logo placeholder */}
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-sece-foreground font-bold text-xl">GLC</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          {t("welcomeBack")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("loginDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />

        {/* <div className="mt-4 text-center text-sm">
          <Link href="/register" className="text-primary hover:underline">
            Don't have an account? Sign up
          </Link>
        </div> */}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 border-t pt-4">
        <div className="text-center text-xs text-muted-foreground">
          {t("footerDesc")}
        </div>
      </CardFooter>
    </Card>
  );
}
