"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContext";


type UserName = "國王老師" | "阿寶";


export default function QuickCreateTask() {

  const router = useRouter();

  const {
    currentUser,
    loading: userLoading,
  } = useUser();


  const [title, setTitle] = useState("");

  const [assignTo, setAssignTo] =
    useState<UserName>("阿寶");

  const [reward, setReward] =
    useState(20);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);



  // 登入身分改變時
  // 預設把任務指派給另一個人
  useEffect(() => {

    if (currentUser === "國王老師") {

      setAssignTo("阿寶");

    }

    if (currentUser === "阿寶") {

      setAssignTo("國王老師");

    }

  }, [currentUser]);



  async function createTask() {

    if (!currentUser) {

      alert("請先選擇身分");

      router.push("/login");

      return;

    }


    if (!title.trim()) {

      return;

    }


    if (loading) {

      return;

    }


    setLoading(true);
    setSuccess(false);



    // 今天 23:59:59
    const due = new Date();

    due.setHours(
      23,
      59,
      59,
      999
    );



    try {

      const res = await fetch(
        "/api/tasks",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            title: title.trim(),

            description: "",

            created_by: currentUser,

            assign_to: assignTo,

            reward,

            due_at: due.toISOString(),

            penalty: 0,

            status: "待完成",

          }),
        }
      );



      const data = await res.json();



      if (!res.ok) {

        alert(
          data.error ??
          "建立任務失敗"
        );

        return;

      }



      // 只清空任務名稱
      // 指派對象和獎勵保留
      setTitle("");

      setSuccess(true);


      // 重新取得首頁 Server Component 資料
      router.refresh();



      window.setTimeout(() => {

        setSuccess(false);

      }, 1500);


    } catch (error) {

      console.error(error);

      alert("建立任務失敗");

    } finally {

      setLoading(false);

    }

  }



  if (userLoading) {

    return (

      <section className="rounded-3xl bg-white p-5 shadow">

        <p className="text-gray-400">
          載入身分中...
        </p>

      </section>

    );

  }



  return (

    <section className="rounded-3xl bg-white p-5 shadow">


      <div className="flex items-center justify-between">

        <h2 className="text-xl font-bold">
          ⚡ 快速建立任務
        </h2>


        {currentUser && (

          <span className="text-sm text-gray-400">

            {currentUser === "國王老師"
              ? "👑"
              : "🧸"}

            {" "}

            {currentUser}

          </span>

        )}

      </div>



      <input
        value={title}

        onChange={(e) =>
          setTitle(e.target.value)
        }

        onKeyDown={(e) => {

          if (
            e.key === "Enter" &&
            !loading
          ) {

            createTask();

          }

        }}

        placeholder="輸入任務名稱"

        className="
          mt-4
          w-full
          rounded-2xl
          border
          p-3
        "
      />



      <div className="mt-4">

        <p className="text-sm text-gray-500">
          指派給
        </p>


        <div className="mt-2 grid grid-cols-2 gap-2">


          <button
            type="button"

            onClick={() =>
              setAssignTo("國王老師")
            }

            className={`
              rounded-2xl
              p-3
              font-bold
              ${
                assignTo === "國王老師"
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
              setAssignTo("阿寶")
            }

            className={`
              rounded-2xl
              p-3
              font-bold
              ${
                assignTo === "阿寶"
                  ? "bg-black text-white"
                  : "bg-gray-100"
              }
            `}
          >

            🧸 阿寶

          </button>


        </div>

      </div>



      <div className="mt-4">

        <p className="text-sm text-gray-500">
          🪙 獎勵
        </p>


        <div className="mt-2 flex gap-2">

          {[5, 10, 20, 50].map((num) => (

            <button
              key={num}
              type="button"

              onClick={() =>
                setReward(num)
              }

              className={`
                flex-1
                rounded-2xl
                p-3
                font-bold
                ${
                  reward === num
                    ? "bg-black text-white"
                    : "bg-gray-100"
                }
              `}
            >

              {num}

            </button>

          ))}

        </div>

      </div>



      <button
        type="button"

        onClick={createTask}

        disabled={
          loading ||
          !currentUser ||
          !title.trim()
        }

        className="
          mt-5
          w-full
          rounded-2xl
          bg-black
          p-3
          font-bold
          text-white
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >

        {loading
          ? "建立中..."
          : "＋ 建立任務"}

      </button>



      {success && (

        <p className="mt-3 text-center font-bold text-green-600">
          ✅ 任務建立成功
        </p>

      )}



      <p className="mt-3 text-center text-sm text-gray-400">
        ⏰ 自動截止今天 23:59
      </p>


    </section>

  );

}