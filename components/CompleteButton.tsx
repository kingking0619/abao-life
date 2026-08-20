"use client";

import { useUser } from "@/components/UserContext";


export default function CompleteButton({

  id,
  status,
  assignTo,
  isLocked = false,

}: {

  id: number;
  status: string;
  assignTo: string;
  isLocked?: boolean;

}) {


  const {
    currentUser,
    loading,
  } = useUser();



  async function submitComplete() {

    const response = await fetch(
      `/api/tasks/${id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          action: "complete",
        }),
      }
    );


    if (response.ok) {

      window.location.reload();

    } else {

      const data = await response.json();

      alert(
        data.error ??
        "回報失敗"
      );

    }

  }



  if (loading) {
    return null;
  }



  // 只有被指派的人可以回報
  if (currentUser !== assignTo) {
    return null;
  }



  // 連鎖任務尚未解鎖
  if (isLocked) {
    return null;
  }



  // 已完成 / 等待核可 不可再回報
  if (
    status === "已完成" ||
    status === "等待核可"
  ) {
    return null;
  }



  return (

    <button
      onClick={submitComplete}
      className={
        status === "已退回"
          ? "mt-4 w-full rounded-2xl bg-orange-500 p-3 font-bold text-white"
          : "mt-4 w-full rounded-2xl bg-black p-3 font-bold text-white"
      }
    >

      {status === "已退回"
        ? "🔄 重新提交"
        : "✅ 回報完成"}

    </button>

  );

}