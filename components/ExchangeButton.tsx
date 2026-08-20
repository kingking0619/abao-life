"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContext";


export default function ExchangeButton({
  id,
}: {
  id: number;
}) {

  const router = useRouter();

  const {
    currentUser,
    loading: userLoading,
  } = useUser();

  const [loading, setLoading] =
    useState(false);



  async function exchange() {

    if (!currentUser) {

      alert("請先選擇身分");

      return;

    }


    if (loading) {
      return;
    }


    const confirmed = window.confirm(
      `${currentUser} 確定要兌換這個商品嗎？`
    );


    if (!confirmed) {
      return;
    }


    setLoading(true);


    try {

      const response = await fetch(
        `/api/shop/${id}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user: currentUser,
          }),
        }
      );


      const result = await response.json();


      if (response.ok) {

        alert("兌換成功！");

        router.refresh();

      } else {

        alert(
          result.error ??
          "兌換失敗"
        );

      }

    } catch (error) {

      console.error(error);

      alert("兌換失敗");

    } finally {

      setLoading(false);

    }

  }



  if (userLoading) {

    return (

      <button
        disabled
        className="mt-4 w-full rounded-2xl bg-gray-300 p-3 font-bold text-white"
      >
        載入中...
      </button>

    );

  }



  return (

    <button
      onClick={exchange}
      disabled={
        loading ||
        !currentUser
      }
      className="mt-4 w-full rounded-2xl bg-black p-3 font-bold text-white disabled:opacity-40"
    >

      {loading
        ? "兌換中..."
        : `兌換 ${
            currentUser === "國王老師"
              ? "👑"
              : "🧸"
          }`}

    </button>

  );

}