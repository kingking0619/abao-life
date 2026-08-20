"use client";

import { useState } from "react";

export default function AddComment({
  taskId,
}: {
  taskId: number;
}) {
  const [user, setUser] = useState("阿寶");
  const [content, setContent] = useState("");

  async function sendComment() {
    if (!content.trim()) return;

    const response = await fetch("/api/task-comments", {
      method: "POST",
      body: JSON.stringify({
        task_id: taskId,
        user_name: user,
        content,
      }),
    });

    if (response.ok) {
      location.reload();
    } else {
      alert("留言失敗");
    }
  }

  return (
    <div className="mt-5 rounded-2xl bg-gray-100 p-4">

      <select
        className="w-full rounded-xl border p-2"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      >
        <option>阿寶</option>
        <option>國王老師</option>
      </select>

      <textarea
        className="mt-3 w-full rounded-xl border p-3"
        rows={4}
        placeholder="輸入留言..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={sendComment}
        className="mt-3 w-full rounded-xl bg-black p-3 text-white"
      >
        送出留言
      </button>

    </div>
  );
}