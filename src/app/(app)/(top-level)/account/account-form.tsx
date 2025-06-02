"use client";
import { type User } from "@supabase/supabase-js";
import { signout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AccountForm({ user }: { user: User | null }) {
  return (
    <div className="bg-muted/40 flex min-h-screen flex-col">
      <main className="flex flex-grow items-center justify-center pb-16">
        <Card className="mx-4 w-full max-w-md sm:mx-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Account Information</CardTitle>
            <CardDescription>View your account details below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email ?? ""}
                disabled
                className="w-full"
              />
            </div>

            <form action={signout} className="w-full">
              <Button type="submit" className="w-full">
                Sign Out
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
