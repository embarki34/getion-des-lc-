import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/forms/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Register - Gestion LC",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-[480px] shadow-lg border-zinc-200 dark:border-zinc-800">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          {/* Logo placeholder */}
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-sece-foreground font-bold text-xl">GLC</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />

        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="text-primary hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 border-t pt-4">
        <div className="text-center text-xs text-muted-foreground w-full">
          By clicking continue, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </Link>
          .
        </div>
      </CardFooter>
    </Card>
  );
}
