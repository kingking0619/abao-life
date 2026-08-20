"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/components/UserContext";


export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const pathname = usePathname();

  const {
    currentUser,
    loading,
  } = useUser();


  useEffect(() => {

    if (loading) {
      return;
    }


    // 登入頁本身不需要登入
    if (pathname === "/login") {

      // 已經有身分又跑到登入頁
      // 直接送回首頁
      if (currentUser) {
        router.replace("/");
      }

      return;
    }


    // 沒有身分 → 登入頁
    if (!currentUser) {
      router.replace("/login");
    }

  }, [
    currentUser,
    loading,
    pathname,
    router,
  ]);


  // UserContext 還在讀 localStorage
  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#fffaf2]">

        <p className="text-gray-400">
          載入中...
        </p>

      </main>

    );

  }


  // 登入頁正常顯示
  if (pathname === "/login") {

    return children;

  }


  // 沒登入時不要先閃一下首頁內容
  if (!currentUser) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#fffaf2]">

        <p className="text-gray-400">
          前往登入...
        </p>

      </main>

    );

  }


  return children;

}