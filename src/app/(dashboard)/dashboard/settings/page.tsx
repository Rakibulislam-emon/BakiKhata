"use client";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTransactionsContext } from "@/context/TransactionsContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User, LogOut, Trash2, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { session, logout } = useAuth();
  const { deleteAllTransactions } = useTransactionsContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
    toast.success("সফলভাবে লগআউট হয়েছে");
  };

  const handleDeleteAccount = async () => {
    toast.promise(
      async () => {
        // 1. Delete all transactions data (Database)
        const res = await deleteAllTransactions();
        if (res.error) throw new Error("ডেটা ডিলিট করা সম্ভব হয়নি");

        // 2. Delete Auth Account (Server-side)
        if (session?.access_token) {
          const apiRes = await fetch("/api/delete-account", {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (!apiRes.ok) {
            const data = await apiRes.json();
            console.warn("Account deletion failed:", data.error);
            toast.error(
              "অ্যাকাউন্ট সার্ভার থেকে ডিলিট করা যায়নি (API Key missing?)"
            );
          }
        }

        // 3. Logout
        await logout();
        router.replace("/");
      },
      {
        loading: "অ্যাকাউন্ট ডিলিট করা হচ্ছে...",
        success: "অ্যাকাউন্ট এবং সমস্ত ডেটা মুছে ফেলা হয়েছে",
        error: "কোথাও সমস্যা হয়েছে (ডেটা মুছেছে, কিন্তু অ্যাকাউন্ট থাকতে পারে)",
      }
    );
  };

  const userInitial = session?.user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">
          সেটিংস
        </h1>
        <p className="text-secondary-500 mt-2 text-lg">
          আপনার অ্যাকাউন্ট এবং অ্যাপ প্রিফারেন্স ম্যানেজ করুন
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>প্রোফাইল</CardTitle>
            <CardDescription>আপনার ব্যক্তিগত তথ্য</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 md:gap-6">
              <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-secondary-100">
                <AvatarImage src="" />
                <AvatarFallback className="text-xl md:text-2xl bg-primary-100 text-primary-700">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-secondary-900">
                  {session?.user?.email?.split("@")[0] || "ব্যবহারকারী"}
                </h3>
                <p className="text-secondary-500 text-sm">
                  {session?.user?.email}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                >
                  ভেরিফাইড অ্যাকাউন্ট
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-100 overflow-hidden">
          <CardHeader className="bg-red-50/50 pb-4">
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              ডেঞ্জার জোন
            </CardTitle>
            <CardDescription className="text-red-600/80">
              এই কাজগুলো অপরিবর্তনীয়, সাবধানে করুন
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-white group hover:border-red-200 transition-colors">
              <div className="space-y-0.5">
                <p className="font-medium text-secondary-900 group-hover:text-red-700 transition-colors">
                  লগ আউট করুন
                </p>
                <p className="text-sm text-secondary-500">
                  বর্তমান সেশন থেকে বের হয়ে যান
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600 border-secondary-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                লগ আউট
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-white group hover:border-red-200 transition-colors">
              <div className="space-y-0.5">
                <p className="font-medium text-secondary-900 group-hover:text-red-700 transition-colors">
                  অ্যাকাউন্ট ডিলিট করুন
                </p>
                <p className="text-sm text-secondary-500">
                  আপনার সমস্ত ডেটা এবং লেনদেন মুছে ফেলা হবে
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    ডিলিট অ্যাকাউন্ট
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>
                      এই কাজটি আর ফিরিয়ে আনা যাবে না। এটি স্থায়ীভাবে আপনার
                      অ্যাকাউন্ট এবং সমস্ত ডেটা মুছে ফেলবে। আপনি কি চালিয়ে যেতে
                      চান?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>বাতিল</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      হ্যাঁ, ডিলিট করুন
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
