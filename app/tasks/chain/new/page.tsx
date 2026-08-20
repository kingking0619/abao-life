"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  useUser,
} from "@/components/UserContext";

import BottomNav from "@/components/BottomNav";


type UserName =
  | "國王老師"
  | "阿寶";


type Step = {

  title: string;

  description: string;

  reward: string;

  due_at: string;

  penalty: string;

};


function createEmptyStep(): Step {

  return {

    title: "",

    description: "",

    reward: "20",

    due_at: "",

    penalty: "0",

  };

}



export default function NewChainTaskPage() {

  const router =
    useRouter();


  const {
    currentUser,
    loading:
      userLoading,
  } = useUser();



  const [
    title,
    setTitle,
  ] = useState("");


  const [
    description,
    setDescription,
  ] = useState("");


  const [
    assignTo,
    setAssignTo,
  ] =
    useState<UserName>(
      "阿寶"
    );


  const [
    steps,
    setSteps,
  ] = useState<Step[]>([
    createEmptyStep(),
    createEmptyStep(),
  ]);


  const [
    loading,
    setLoading,
  ] = useState(false);



  // 預設指派給另一個人
  useEffect(() => {

    if (
      currentUser ===
      "國王老師"
    ) {

      setAssignTo(
        "阿寶"
      );

    }


    if (
      currentUser ===
      "阿寶"
    ) {

      setAssignTo(
        "國王老師"
      );

    }

  }, [currentUser]);



  function updateStep(
    index: number,
    field:
      keyof Step,
    value: string
  ) {

    setSteps(
      current =>
        current.map(
          (
            step,
            stepIndex
          ) =>
            stepIndex ===
            index
              ? {
                  ...step,
                  [field]:
                    value,
                }
              : step
        )
    );

  }



  function addStep() {

    setSteps(
      current => [
        ...current,
        createEmptyStep(),
      ]
    );

  }



  function removeStep(
    index:number
  ) {

    if (
      steps.length <= 2
    ) {

      alert(
        "連鎖任務至少需要兩關"
      );

      return;

    }


    setSteps(
      current =>
        current.filter(
          (
            _,
            stepIndex
          ) =>
            stepIndex !==
            index
        )
    );

  }



  async function submit() {

    if (!currentUser) {

      alert(
        "請先選擇身分"
      );

      router.push(
        "/login"
      );

      return;

    }


    if (
      !title.trim()
    ) {

      alert(
        "請輸入連鎖任務名稱"
      );

      return;

    }


    const emptyIndex =
      steps.findIndex(
        step =>
          !step.title.trim()
      );


    if (
      emptyIndex !== -1
    ) {

      alert(
        `請輸入第 ${
          emptyIndex + 1
        } 關名稱`
      );

      return;

    }


    if (loading) {

      return;

    }


    setLoading(true);


    try {

      const response =
        await fetch(
          "/api/task-chains",
          {
            method:"POST",

            headers:{
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({

                title,

                description,

                created_by:
                  currentUser,

                assign_to:
                  assignTo,

                steps:
                  steps.map(
                    step => ({

                      title:
                        step.title,

                      description:
                        step.description,

                      reward:
                        Number(
                          step.reward
                        ),

                      due_at:
                        step.due_at ||
                        null,

                      penalty:
                        Number(
                          step.penalty
                        ),

                    })
                  ),

              }),
          }
        );


      const data =
        await response.json();


      if (
        !response.ok
      ) {

        alert(
          data.error ??
          "建立失敗"
        );

        return;

      }


      router.push(
        "/tasks"
      );

      router.refresh();


    } catch (error) {

      console.error(
        error
      );

      alert(
        "建立連鎖任務失敗"
      );

    } finally {

      setLoading(
        false
      );

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

    <main className="min-h-screen bg-[#fffaf2] p-5 pb-32 text-gray-800">


      <div className="mx-auto max-w-md">


        <Link
          href="/tasks"
          className="mb-5 block text-gray-500"
        >
          ← 返回任務
        </Link>



        <h1 className="text-3xl font-bold">
          🔗 建立連鎖任務
        </h1>



        {/* 基本資料 */}

        <section className="mt-5 rounded-3xl bg-white p-5 shadow">


          <label className="font-bold">
            連鎖任務名稱
          </label>


          <input
            value={title}
            onChange={(e)=>
              setTitle(
                e.target.value
              )
            }
            placeholder="例如：房間大掃除"
            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
          />



          <label className="mt-5 block font-bold">
            說明
          </label>


          <textarea
            value={
              description
            }
            onChange={(e)=>
              setDescription(
                e.target.value
              )
            }
            rows={3}
            placeholder="整個連鎖任務的說明..."
            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
          />



          <div className="mt-5">


            <p className="font-bold">
              建立者
            </p>


            <div className="mt-2 rounded-2xl bg-[#fff5dc] p-3 font-bold">

              {
                currentUser ===
                "國王老師"
                  ? "👑 國王老師"
                  : "🧸 阿寶"
              }

            </div>


          </div>



          <div className="mt-5">

            <p className="font-bold">
              指派給
            </p>


            <div className="mt-2 grid grid-cols-2 gap-2">


              <button
                type="button"
                onClick={()=>
                  setAssignTo(
                    "國王老師"
                  )
                }
                className={`
                  rounded-2xl
                  p-3
                  font-bold
                  ${
                    assignTo ===
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
                onClick={()=>
                  setAssignTo(
                    "阿寶"
                  )
                }
                className={`
                  rounded-2xl
                  p-3
                  font-bold
                  ${
                    assignTo ===
                    "阿寶"
                      ? "bg-black text-white"
                      : "bg-gray-100"
                  }
                `}
              >
                🧸 阿寶
              </button>


            </div>


          </div>


        </section>



        {/* 關卡 */}

        <section className="mt-5">


          <div className="mb-3 flex items-center justify-between">


            <h2 className="text-xl font-bold">
              🔗 任務關卡
            </h2>


            <button
              type="button"
              onClick={
                addStep
              }
              className="rounded-2xl bg-black px-4 py-2 text-sm font-bold text-white"
            >
              ＋ 新增一關
            </button>


          </div>



          <div className="space-y-4">


            {steps.map(
              (
                step,
                index
              ) => (

                <div
                  key={index}
                  className="rounded-3xl bg-white p-5 shadow"
                >


                  <div className="flex items-center justify-between">


                    <h3 className="text-lg font-bold">

                      第 {
                        index + 1
                      } 關

                      {index === 0 && (
                        <span className="ml-2 text-xs text-green-600">
                          首關
                        </span>
                      )}

                    </h3>


                    <button
                      type="button"
                      onClick={()=>
                        removeStep(
                          index
                        )
                      }
                      className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-500"
                    >
                      刪除
                    </button>


                  </div>



                  <input
                    value={
                      step.title
                    }
                    onChange={(e)=>
                      updateStep(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder={`第 ${
                      index + 1
                    } 關任務名稱`}
                    className="mt-4 w-full rounded-2xl bg-gray-100 p-3"
                  />



                  <textarea
                    value={
                      step.description
                    }
                    onChange={(e)=>
                      updateStep(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="任務說明（可選）"
                    rows={2}
                    className="mt-3 w-full rounded-2xl bg-gray-100 p-3"
                  />



                  <label className="mt-4 block text-sm font-bold">
                    🪙 完成獎勵
                  </label>


                  <input
                    type="number"
                    min="0"
                    value={
                      step.reward
                    }
                    onChange={(e)=>
                      updateStep(
                        index,
                        "reward",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
                  />



                  {/* 第一關才設定期限 */}

                    {index === 0 ? (

                    <>

                        <label className="mt-4 block text-sm font-bold">
                        ⏰ 第一關截止時間
                        </label>


                        <input
                        type="datetime-local"
                        value={
                            step.due_at
                        }
                        onChange={(e)=>
                            updateStep(
                            index,
                            "due_at",
                            e.target.value
                            )
                        }
                        className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
                        />



                        <label className="mt-4 block text-sm font-bold">
                        ⚠️ 逾期扣除
                        </label>


                        <input
                        type="number"
                        min="0"
                        value={
                            step.penalty
                        }
                        onChange={(e)=>
                            updateStep(
                            index,
                            "penalty",
                            e.target.value
                            )
                        }
                        className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
                        />

                    </>

                    ) : (

                    <div className="mt-4 rounded-2xl bg-gray-50 p-3">

                        <p className="text-sm font-bold text-gray-500">

                        🔒 第 {index} 關核可後解鎖

                        </p>

                        <p className="mt-1 text-xs text-gray-400">

                        解鎖後再設定這一關的截止時間

                        </p>

                    </div>

                    )}


                </div>

              )
            )}


          </div>


        </section>



        <button
          type="button"
          onClick={submit}
          disabled={
            loading ||
            !currentUser
          }
          className="mt-6 w-full rounded-3xl bg-black p-4 font-bold text-white disabled:opacity-40"
        >

          {loading
            ? "建立中..."
            : `🔗 建立 ${
                steps.length
              } 關連鎖任務`}

        </button>


      </div>


      <BottomNav />


    </main>

  );

}