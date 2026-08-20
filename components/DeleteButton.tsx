"use client";

import { useRouter } from "next/navigation";


export default function DeleteButton({

  id,
  compact = false,

}: {

  id: number | string;
  compact?: boolean;

}) {

  const router = useRouter();



  async function removeTask() {

    const confirmed =
      window.confirm(
        "確定要刪除這個任務嗎？"
      );


    if (!confirmed) {
      return;
    }



    const response =
      await fetch(
        `/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );


    const data =
      await response.json();



    if (!response.ok) {

      alert(
        data.error ??
        "刪除失敗"
      );

      return;

    }



    router.push("/tasks");

    router.refresh();

  }



  if (compact) {

    return (

      <button
        type="button"
        onClick={removeTask}
        className="
          rounded-xl
          bg-red-50
          px-3
          py-2
          text-sm
          font-bold
          text-red-500
        "
        title="刪除任務"
      >
        🗑️
      </button>

    );

  }



  return (

    <button
      type="button"
      onClick={removeTask}
      className="
        mt-4
        w-full
        rounded-2xl
        bg-red-50
        p-3
        font-bold
        text-red-500
      "
    >
      🗑️ 刪除任務
    </button>

  );

}