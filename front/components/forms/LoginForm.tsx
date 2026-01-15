"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Mail, Lock } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const formSchema = z.object({
    email: z.string().email({
      message: t("emailInvalid"),
    }),
    password: z.string().min(8, {
      message: t("passwordMin"),
    }),
    rememberMe: z.boolean().default(false),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await authApi.login({
        email: values.email,
        password: values.password,
      });

      console.log("Login successful, token:", response.data.accessToken);
      toast.success(t("loginSuccess"));

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t("loginFailed"));
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="name@example.com"
                    className="pl-9"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>{t("password")}</FormLabel>
              </div>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    {...field}
                  />
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t("rememberMe")}</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button
          className="w-full transition-all duration-300"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("signingIn")}
            </>
          ) : (
            t("signIn")
          )}
        </Button>
      </form>
    </Form>
  );
}
