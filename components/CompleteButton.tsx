"use client";

import { useRouter } from "next/navigation";

export default function CompleteButton({
  id,
}: {
  id: number;
}) {

  const router = useRouter();


  async function completeTask() {

    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
    });


    router.refresh();

  }


  return (
    <button
      onClick={completeTask}
      className="mt-4 w-full rounded-2xl bg-[#fff0c2] p-3"
    >
      完成任務
    </button>
  );
}