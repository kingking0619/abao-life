import ApproveButton from "@/components/ApproveButton";
import CompleteButton from "@/components/CompleteButton";
import DeleteButton from "@/components/DeleteButton";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ChatList from "@/components/ChatList";
import ChatInput from "@/components/ChatInput";

import { supabase } from "@/lib/supabase";


function getUserIcon(name:string){

  if(name === "國王老師"){
    return "👑";
  }

  return "🧸";

}


function formatDueDate(
  date:string|null
){

  if(!date){
    return "無期限";
  }


  const d =
    new Date(date);


  return (
    `${d.getMonth()+1}/${d.getDate()} ` +
    `${String(d.getHours()).padStart(2,"0")}:` +
    `${String(d.getMinutes()).padStart(2,"0")}`
  );

}


export default async function TaskDetailPage({
  params,
}:{
  params:Promise<{id:string}>;
}){


  const {id} =
    await params;



  // =====================
  // 取得任務
  // =====================

  const {
    data:task,
    error,
  } = await supabase
    .from("tasks")
    .select("*")
    .eq("id",id)
    .single();



  if(error || !task){

    return(

      <main className="min-h-screen bg-[#fffaf2] p-5 text-gray-800">

        <div className="mx-auto max-w-md">

          <h1 className="text-2xl font-bold">
            找不到任務
          </h1>


          <Link
            href="/tasks"
            className="mt-5 block text-gray-500"
          >
            ← 返回任務列表
          </Link>

        </div>

      </main>

    );

  }



  // =====================
  // 取得聊天室
  // =====================

  const {
    data:comments,
  } = await supabase
    .from("task_comments")
    .select("*")
    .eq("task_id",id)
    .order("created_at",{
      ascending:true,
    });



  // =====================
  // 連鎖任務狀態
  // =====================

  const isChainTask =
    Boolean(task.chain_id);


  const locked =
    isChainTask &&
    task.is_locked === true;



  return(

    <main className="min-h-screen bg-[#fffaf2] p-5 pb-28 text-gray-800">


      <div className="mx-auto max-w-md">


        <Link
          href="/tasks"
          className="mb-5 block text-gray-500"
        >
          ← 返回任務
        </Link>



        {/* 任務資訊 */}

        <section className="rounded-3xl bg-white p-5 shadow">


          {/* 標題 */}

          <div className="flex items-start justify-between gap-3">


            <div className="min-w-0 flex-1">


              {isChainTask && (

                <p className="mb-2 text-sm font-bold text-gray-400">

                  🔗 連鎖任務・第 {task.chain_step} 關

                </p>

              )}


              <h1 className="break-words text-2xl font-bold">

                {task.title}

              </h1>


            </div>



            <div className="flex shrink-0 items-center gap-2">

  <Link
    href={`/tasks/${task.id}/edit`}
    className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-bold"
  >
    ✏️ 編輯
  </Link>


  <DeleteButton
    id={task.id}
    compact
  />

</div>


          </div>



          {/* 指派者 */}

          <p className="mt-4 text-gray-500">

            {getUserIcon(
              task.assign_to
            )}

            {" "}

            指派給：

            {task.assign_to}

          </p>



          {/* 建立者 */}

          {task.created_by && (

            <p className="mt-2 text-sm text-gray-500">

              建立者：

              {getUserIcon(
                task.created_by
              )}

              {" "}

              {task.created_by}

            </p>

          )}



          {/* 狀態 */}

          <p className="mt-3">

            狀態：

            <span className="ml-2 font-bold">

              {locked
                ? "🔒 尚未解鎖"
                : task.status}

            </span>

          </p>



          {/* 獎勵 */}

          <p className="mt-3 font-bold">

            🪙 {task.reward} 阿寶幣

          </p>



          {/* 描述 */}

          {task.description && (

            <div className="mt-4 rounded-2xl bg-gray-100 p-3">


              <p className="text-sm text-gray-500">

                📝 任務描述

              </p>


              <p className="mt-1 whitespace-pre-wrap">

                {task.description}

              </p>


            </div>

          )}



          {/* =====================
              鎖定中的連鎖任務
          ===================== */}

          {locked && (

            <div className="mt-5 rounded-2xl bg-gray-100 p-4">

              <p className="font-bold">

                🔒 第 {task.chain_step} 關尚未解鎖

              </p>


              <p className="mt-2 text-sm text-gray-500">

                完成並核可上一關後，
                這一關會自動解鎖。

              </p>

            </div>

          )}



          {/* =====================
              期限
          ===================== */}

          {!locked && (

            <p className="mt-4">

              ⏰ 期限：

              {task.due_at
                ? formatDueDate(task.due_at)
                : "無期限"}

            </p>

          )}



          {/* 逾期扣款 */}

          {!locked &&
            task.penalty > 0 && (

            <p className="mt-2 text-red-500">

              ⚠️ 逾期扣 {task.penalty} 阿寶幣

            </p>

          )}



          {/* =====================
              回報完成 / 重新提交
              
              唯一限制：
              is_locked === true 不可回報

              沒期限仍然可以完成
          ===================== */}

          {!locked && (

            <CompleteButton
              id={Number(task.id)}
              status={task.status}
              assignTo={task.assign_to}
              isLocked={Boolean(task.is_locked)}
            />

          )}



          {/* =====================
              核可 / 退回
          ===================== */}

          {
            task.status === "等待核可" &&
            !locked &&
            (

              <ApproveButton
                id={Number(task.id)}
                createdBy={task.created_by}
              />

            )
          }



        </section>



        {/* =====================
            任務聊天室
        ===================== */}

        <section className="mb-8 mt-5 rounded-3xl bg-white p-5 shadow">


          <h2 className="mb-5 text-xl font-bold">

            💬 任務聊天室

          </h2>


          <ChatList
            comments={
              comments ?? []
            }
          />


          <ChatInput
            taskId={
              Number(task.id)
            }
          />


          <div className="h-8"/>


        </section>


      </div>


      <BottomNav />


    </main>

  );

}