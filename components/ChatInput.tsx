"use client";

import { useState } from "react";
import { useUser } from "@/components/UserContext";


export default function ChatInput({
  taskId,
}: {
  taskId: number;
}) {

  const {
    currentUser,
    loading: userLoading,
  } = useUser();


  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);


  async function sendMessage() {

    if (!currentUser) {

      alert("請先選擇身分");

      return;

    }


    if (!content.trim()) {

      return;

    }


    if (loading) {

      return;

    }


    setLoading(true);


    try {

      const response = await fetch(
        "/api/task-comments",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            task_id: taskId,
            user_name: currentUser,
            content: content.trim(),
            message_type: "chat",
          }),
        }
      );


      if (response.ok) {

        setContent("");

        location.reload();

      } else {

        const data = await response.json();

        alert(
          "留言失敗：" +
          (data.error ?? "未知錯誤")
        );

      }

    } catch (error) {

      console.error(error);

      alert("留言失敗");

    } finally {

      setLoading(false);

    }

  }


  if (userLoading) {

    return (

      <div className="mt-5 rounded-3xl bg-white p-4 shadow">

        <p className="text-sm text-gray-400">
          載入身分中...
        </p>

      </div>

    );

  }


  return (

    <div className="mt-5 rounded-3xl bg-white p-4 shadow">


      <div className="mb-3 rounded-2xl bg-[#fff5dc] p-3 text-sm">

        目前發話：

        <span className="ml-2 font-bold">

          {currentUser === "國王老師"
            ? "👑 國王老師"
            : currentUser === "阿寶"
            ? "🧸 阿寶"
            : "尚未選擇身分"}

        </span>

      </div>



      <textarea
        className="w-full rounded-2xl bg-gray-100 p-3"
        rows={3}
        placeholder="輸入訊息..."
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }

        onKeyDown={(e) => {

          if (
            e.key === "Enter" &&
            !e.shiftKey
          ) {

            e.preventDefault();

            sendMessage();

          }

        }}
      />



      <button
        onClick={sendMessage}
        disabled={
          loading ||
          !currentUser ||
          !content.trim()
        }
        className="mt-3 w-full rounded-2xl bg-black p-3 font-bold text-white disabled:opacity-40"
      >

        {loading
          ? "傳送中..."
          : "送出"}

      </button>


    </div>

  );

}