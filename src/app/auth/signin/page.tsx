"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn("sanity-login", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      router.push("/");
    } catch (error) {
      console.error("Sign-in failed:", error);
      alert(`Sign In failed: ${error || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    redirect("/auth/signup");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mainbackground">
      <div className="flex flex-col h-fit w-fit p-8 items-center bg-white rounded-xl">
        <h1 className="text-2xl text-center font-semibold">
          Sign into your account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your data below to sign into your account
        </p>
        <form onSubmit={handleSignInSubmit} className="w-full mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-light1"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Please wait
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        <div className="flex items-center gap-4 w-full my-6">
          <Separator className="flex-1" orientation="horizontal" />
          <span className="text-sm text-muted-foreground">
            Don&apos;t have an account yet?
          </span>
          <Separator className="flex-1" orientation="horizontal" />
        </div>
        <Button
          onClick={handleSignUpRedirect}
          className="w-full"
          variant="outline"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}
