"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BottomNav from "@/components/BottomNav";
import { useUser } from "@/components/UserContext";


type UserName = "國王老師" | "阿寶";


export default function NewTaskPage() {

  const router = useRouter();

  const {
    currentUser,
    loading: userLoading,
  } = useUser();


  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [person, setPerson] =
    useState<UserName>("阿寶");

  const [reward, setReward] =
    useState("20");

  const [dueAt, setDueAt] =
    useState("");

  const [penalty, setPenalty] =
    useState("0");

  const [isDaily, setIsDaily] =
    useState(false);

  const [loading, setLoading] =
    useState(false);



  // 登入身分確定後
  // 預設指派給另一個人
  useEffect(() => {

    if (currentUser === "國王老師") {

      setPerson("阿寶");

    }

    if (currentUser === "阿寶") {

      setPerson("國王老師");

    }

  }, [currentUser]);



  async function createTask() {

    if (!currentUser) {

      alert("請先選擇身分");

      router.push("/login");

      return;

    }


    if (!title.trim()) {

      alert("請輸入任務名稱");

      return;

    }


    if (loading) {
      return;
    }


    setLoading(true);


    try {

      const response =
        await fetch(
          "/api/tasks",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              title:
                title.trim(),

              description,

              created_by:
                currentUser,

              assign_to:
                person,

              reward:
                Number(reward),

              due_at:
                dueAt
                  ? new Date(
                      dueAt
                    ).toISOString()
                  : null,

              penalty:
                Number(penalty),

              is_daily:
                isDaily,

              task_mode:
                isDaily
                  ? "每日循環任務"
                  : "一般任務",

              status:
                "待完成",

            }),
          }
        );



      const data =
        await response.json();


      if (!response.ok) {

        alert(
          "建立失敗：" +
          (
            data.error ??
            "未知錯誤"
          )
        );

        return;

      }


      alert("任務建立成功！");


      router.push(
        "/tasks"
      );

      router.refresh();


    } catch (error) {

      console.error(error);

      alert(
        "建立任務失敗"
      );

    } finally {

      setLoading(false);

    }

  }



  if (userLoading) {

    return (

      <main className="min-h-screen bg-[#fffaf2] p-5">

        <div className="mx-auto max-w-md text-gray-400">

          載入身分中...

        </div>

      </main>

    );

  }



  return (

    <main className="min-h-screen bg-[#fffaf2] p-5 pb-28 text-gray-800">


      <div className="mx-auto max-w-md">


        <h1 className="mb-6 text-3xl font-bold">

          ＋ 新增任務

        </h1>



        {/* 目前身分 */}

        <section className="mb-5 rounded-3xl bg-[#fff5dc] p-4">


          <p className="text-sm text-gray-500">

            建立者

          </p>


          <p className="mt-1 font-bold">

            {currentUser ===
            "國王老師"
              ? "👑 國王老師"
              : "🧸 阿寶"}

          </p>


        </section>



        <section className="rounded-3xl bg-white p-5 shadow">


          {/* 任務名稱 */}

          <label className="font-bold">

            任務名稱

          </label>


          <input
            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
            placeholder="例如：洗碗"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />



          {/* 任務描述 */}

          <label className="mt-5 block font-bold">

            任務描述

          </label>


          <textarea
            className="mt-2 h-24 w-full rounded-2xl bg-gray-100 p-3"
            placeholder="補充任務內容、注意事項..."
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />



          {/* 指派 */}

          <label className="mt-5 block font-bold">

            指派給

          </label>


          <div className="mt-2 grid grid-cols-2 gap-2">


            <button
              type="button"
              onClick={() =>
                setPerson(
                  "國王老師"
                )
              }
              className={`
                rounded-2xl
                p-3
                font-bold
                ${
                  person ===
                  "國王老師"
                    ? "bg-black text-white"
                    : "bg-gray-100"
                }
              `}
            >

              👑 國王老師

            </button>



            <button
              type="button"
              onClick={() =>
                setPerson(
                  "阿寶"
                )
              }
              className={`
                rounded-2xl
                p-3
                font-bold
                ${
                  person ===
                  "阿寶"
                    ? "bg-black text-white"
                    : "bg-gray-100"
                }
              `}
            >

              🧸 阿寶

            </button>


          </div>



          {/* 獎勵 */}

          <label className="mt-5 block font-bold">

            阿寶幣獎勵

          </label>


          <input
            type="number"
            min="0"
            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
            value={reward}
            onChange={(e) =>
              setReward(
                e.target.value
              )
            }
          />



          {/* 截止 */}

          <label className="mt-5 block font-bold">

            截止時間

          </label>


          <input
            type="datetime-local"
            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
            value={dueAt}
            onChange={(e) =>
              setDueAt(
                e.target.value
              )
            }
          />



          {/* 扣款 */}

          <label className="mt-5 block font-bold">

            逾期扣除阿寶幣

          </label>


          <input
            type="number"
            min="0"
            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
            value={penalty}
            onChange={(e) =>
              setPenalty(
                e.target.value
              )
            }
          />



          {/* 每日循環 */}

          <label className="mt-5 flex items-center gap-3 rounded-2xl bg-gray-50 p-4 font-bold">


            <input
              type="checkbox"
              checked={isDaily}
              onChange={(e) =>
                setIsDaily(
                  e.target.checked
                )
              }
              className="h-5 w-5"
            />


            <div>

              <p>
                🔁 每日循環任務
              </p>

              <p className="mt-1 text-xs font-normal text-gray-400">

                勾選後會建立為每日任務

              </p>

            </div>


          </label>



          {/* 建立 */}

          <button
            onClick={createTask}
            disabled={
              loading ||
              !currentUser ||
              !title.trim()
            }
            className="mt-6 w-full rounded-2xl bg-black p-4 font-bold text-white disabled:opacity-40"
          >

            {loading
              ? "建立中..."
              : isDaily
              ? "🔁 建立每日任務"
              : "建立任務"}

          </button>


        </section>



        <Link
          href="/tasks"
          className="mt-5 block text-center text-gray-500"
        >

          ← 返回任務列表

        </Link>


      </div>


      <BottomNav />


    </main>

  );

}