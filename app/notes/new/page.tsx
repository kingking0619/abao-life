"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/components/UserContext";


export default function NewNotePage() {

  const router = useRouter();

  const {
    currentUser,
    loading: userLoading,
  } = useUser();


  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);



  async function submit() {

    if (!currentUser) {

      alert("請先選擇身分");

      router.push("/login");

      return;

    }


    if (!title.trim()) {

      alert("請輸入標題");

      return;

    }


    if (loading) {

      return;

    }


    setLoading(true);



    try {

      const res = await fetch(
        "/api/notes",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            title: title.trim(),

            content,

            created_by: currentUser,

          }),
        }
      );


      const data = await res.json();


      if (!res.ok) {

        alert(
          data.error ??
          "新增記事失敗"
        );

        return;

      }


      router.push("/notes");

      router.refresh();


    } catch (error) {

      console.error(error);

      alert("新增記事失敗");

    } finally {

      setLoading(false);

    }

  }



  if (userLoading) {

    return (

      <main className="min-h-screen bg-[#fffaf2] p-5 text-gray-800">

        <div className="mx-auto max-w-md text-gray-400">
          載入身分中...
        </div>

      </main>

    );

  }



  return (

    <main className="min-h-screen bg-[#fffaf2] p-5 pb-28 text-gray-800">

      <div className="mx-auto max-w-md">


        <Link
          href="/notes"
          className="mb-5 block text-gray-500"
        >
          ← 返回記事
        </Link>



        <section className="rounded-3xl bg-white p-5 shadow">


          <h1 className="text-2xl font-bold">
            📝 新增記事
          </h1>



          <div className="mt-4 rounded-2xl bg-[#fff5dc] p-3">

            <p className="text-sm text-gray-500">
              建立者
            </p>

            <p className="mt-1 font-bold">

              {currentUser === "國王老師"
                ? "👑 國王老師"
                : currentUser === "阿寶"
                ? "🧸 阿寶"
                : "尚未選擇身分"}

            </p>

          </div>



          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="記事標題"
            className="mt-5 w-full rounded-2xl border p-3"
          />



          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="輸入內容..."
            rows={6}
            className="mt-4 w-full rounded-2xl border p-3"
          />



          <button
            onClick={submit}
            disabled={
              loading ||
              !currentUser ||
              !title.trim()
            }
            className="mt-6 w-full rounded-2xl bg-black p-3 font-bold text-white disabled:opacity-40"
          >

            {loading
              ? "建立中..."
              : "新增記事"}

          </button>


        </section>


      </div>

    </main>

  );

}