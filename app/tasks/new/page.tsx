"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function NewTaskPage() {

  const [title, setTitle] = useState("");
  const [person, setPerson] = useState("阿寶");
  const [reward, setReward] = useState("20");


  async function createTask() {

    const response = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        title,
        assign_to: person,
        reward: Number(reward),
        status: "待完成",
      }),
    });


    if (response.ok) {
      alert("任務建立成功！");
    } else {
      alert("建立失敗");
    }

  }


  return (
    <main className="min-h-screen bg-[#fffaf2] p-5 text-gray-800">

      <div className="mx-auto max-w-md">

        <h1 className="mb-6 text-3xl font-bold">
          ＋ 新增任務
        </h1>


        <section className="rounded-3xl bg-white p-5 shadow">


          <label className="font-bold">
            任務名稱
          </label>


          <input
            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
            placeholder="例如：洗碗"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />


          <label className="mt-5 block font-bold">
            指派給
          </label>


          <select
            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
          >

            <option value="阿寶">
              阿寶
            </option>


            <option value="國王老師">
              國王老師
            </option>


          </select>



          <label className="mt-5 block font-bold">
            阿寶幣獎勵
          </label>


          <input
            type="number"
            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />



          <button
            onClick={createTask}
            className="mt-6 w-full rounded-2xl bg-black p-4 font-bold text-white"
          >
            建立任務
          </button>


        </section>



        <Link
          href="/tasks"
          className="mt-5 block text-center text-gray-500"
        >
          ← 返回任務列表
        </Link>


        <BottomNav />


      </div>

    </main>
  );
}