"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { credentialsLogin } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import {signIn} from 'next-auth/react'


export function LoginForm() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const response = await credentialsLogin(formData);

      if (!!response.error) {
        setError(response.error);
      } else {
        router.push("/courses");
      }
    } catch (error) {
      setError(error.message);
    }
  }

  // const handleAuth = () => {
  //   signIn("google", { callbackUrl: "http://localhost:3000/" });
  // };
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="bg-red-500 text-red-50">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>

        {/* <button
          onClick={handleAuth}
          className=" w-full mt-4 py-2 border-gray-600/30 border rounded-md flex items-center gap-2 justify-center"
        >
         
          <span>Google</span>
        </button> */}
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?
          <p>
            <span>Register as </span>
            <Link href="/register/instructor" className="underline">
              Instructor
            </Link>
            <span> or </span>
            <Link href="/register/student" className="underline">
              Student
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
