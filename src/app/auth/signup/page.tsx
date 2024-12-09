"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signUp } from "@/lib/utils/authRequests";
import { Loader2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      alert(`Sign up successful! Welcome, ${user.name}`);
      router.push("/auth/signin");
    } catch (error) {
      console.error(error);
      alert(`Sign up failed: ${error || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInRedirect = () => {
    redirect("/auth/signin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mainbackground">
      <div className="flex flex-col h-fit w-fit p-8 items-center bg-white rounded-xl">
        <h1 className="text-2xl text-center font-semibold">
          Create an account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your data below to create your account
        </p>
        <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
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
              placeholder="Create a password"
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
              "Sign Up"
            )}
          </Button>
        </form>
        <div className="flex items-center gap-4 w-full my-6">
          <Separator className="flex-1" orientation="horizontal" />
          <span className="text-sm text-muted-foreground">
            already have an account?
          </span>
          <Separator className="flex-1" orientation="horizontal" />
        </div>
        <Button
          onClick={handleSignInRedirect}
          className="w-full"
          variant="outline"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
