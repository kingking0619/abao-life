import SortableCompletedList from "@/components/SortableCompletedList";
import BottomNav from "@/components/BottomNav";
import SortableTaskList from "@/components/SortableTaskList";
import Link from "next/link";
import { supabase } from "@/lib/supabase";


function isToday(date:string|null){

  if(!date) return false;

  const target = new Date(date);
  const today = new Date();

  return (
    target.getFullYear() === today.getFullYear()
    &&
    target.getMonth() === today.getMonth()
    &&
    target.getDate() === today.getDate()
  );

}


function isExpired(date:string|null){

  if(!date) return false;

  return new Date(date) < new Date();

}


function getIcon(name:string){

  return name === "國王老師"
    ? "👑"
    : "🧸";

}


export default async function TasksPage(){


  const {
    data:tasks,
    error,
  } = await supabase
    .from("tasks")
    .select(`
      *,
      task_comments(
        content,
        user_name,
        created_at
      )
    `)
    .order("sort_order",{
      ascending:true,
    });


  const {
    data:chains,
    error:chainError,
  } = await supabase
    .from("task_chains")
    .select("*")
    .order("created_at",{
      ascending:false,
    });


  if(error){
    console.log(error);
  }

  if(chainError){
    console.log(chainError);
  }


  const allTasks =
    tasks ?? [];


  // =====================
  // 非連鎖任務
  // =====================

  const normalPool =
    allTasks.filter(
      task => !task.chain_id
    );


  const activeTasks =
    normalPool.filter(
      task =>
        task.status !== "已完成"
    );


  const expiredTasks =
    activeTasks.filter(
      task =>
        isExpired(task.due_at)
        &&
        !isToday(task.due_at)
    );


  const urgentTasks =
    activeTasks.filter(
      task =>
        isToday(task.due_at)
    );


  const dailyTasks =
    activeTasks.filter(
      task =>
        task.is_daily === true
        &&
        !isToday(task.due_at)
        &&
        !isExpired(task.due_at)
    );


  const normalTasks =
    activeTasks.filter(
      task =>
        task.is_daily !== true
        &&
        !isToday(task.due_at)
        &&
        !isExpired(task.due_at)
    );


  const completedTasks =
    normalPool.filter(
      task =>
        task.status === "已完成"
    );


  // =====================
  // 連鎖任務摘要
  // =====================

  const chainSummaries =
    (chains ?? []).map(chain=>{

      const chainTasks =
        allTasks
          .filter(
            task =>
              task.chain_id === chain.id
          )
          .sort(
            (a,b)=>
              Number(a.chain_step) -
              Number(b.chain_step)
          );


      const completedCount =
        chainTasks.filter(
          task =>
            task.status === "已完成"
        ).length;


      const currentTask =
        chainTasks.find(
          task =>
            task.status !== "已完成"
            &&
            task.is_locked !== true
        );


      const allCompleted =
        chainTasks.length > 0
        &&
        completedCount === chainTasks.length;


      return {
        ...chain,
        tasks:chainTasks,
        completedCount,
        totalCount:chainTasks.length,
        currentTask,
        allCompleted,
      };

    });

      // =====================
  // 連鎖任務分類
  // =====================

  const activeChains =
    chainSummaries.filter(
      chain =>
        !chain.allCompleted
    );


  const completedChains =
    chainSummaries.filter(
      chain =>
        chain.allCompleted
    );
      // =====================
  // 已完成項目混合排序
  // completed_sort_order 專門控制已完成區
  // =====================

  const completedItems = [

    ...completedTasks.map(task => ({

      type: "task" as const,

      id: `task-${task.id}`,

      task,

      completedAt:
       task.completed_at
    ? new Date(task.completed_at).getTime()
    : 0,

      sortOrder:
        task.completed_sort_order ?? null,

    })),


    ...completedChains.map(chain => ({

      type: "chain" as const,

      id: `chain-${chain.id}`,

      chain,

      completedAt:
        chain.completed_at
          ? new Date(chain.completed_at).getTime()
          : 0,

      sortOrder:
        chain.completed_sort_order ?? null,

    })),

  ].sort((a,b)=>{

    const aHasOrder =
      a.sortOrder !== null &&
      a.sortOrder !== undefined;

    const bHasOrder =
      b.sortOrder !== null &&
      b.sortOrder !== undefined;


    // 兩個都有手動排序
    if(aHasOrder && bHasOrder){

      return (
        Number(a.sortOrder) -
        Number(b.sortOrder)
      );

    }


    // A 有手動排序、B 沒有
    if(aHasOrder && !bHasOrder){

      return 1;

    }


    // B 有手動排序、A 沒有
    if(!aHasOrder && bHasOrder){

      return -1;

    }


    // 都沒手動排序
    // 新完成的在上面
    return (
      b.completedAt -
      a.completedAt
    );

  });

  return (

    <main className="min-h-screen bg-[#fffaf2] p-5 pb-32 text-gray-800">

      <div className="mx-auto max-w-md">


        {/* 標題 */}

        <div className="mb-6 flex items-center justify-between gap-3">

          <h1 className="text-3xl font-bold">
            📋 任務
          </h1>


          <div className="flex items-center gap-2">


            <Link
              href="/calendar"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-white
                text-lg
                shadow
                active:scale-95
              "
              title="月曆"
            >
              📅
            </Link>


            <Link
              href="/tasks/chain/new"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-white
                text-lg
                shadow
                active:scale-95
              "
              title="建立連鎖任務"
            >
              🔗
            </Link>


            <Link
              href="/tasks/new"
              className="
                rounded-2xl
                bg-black
                px-4
                py-3
                text-sm
                font-bold
                text-white
                active:scale-95
              "
            >
              ＋ 新增
            </Link>

          </div>

        </div>


        {/* 逾期任務 */}

        {expiredTasks.length > 0 && (

          <>
            <h2 className="mb-3 text-xl font-bold">
              ⚠️ 逾期任務
            </h2>

            <SortableTaskList
              tasks={expiredTasks}
            />
          </>

        )}


        {/* 十萬火急 */}

        <h2 className="mb-3 mt-8 text-xl font-bold">
          🔥 十萬火急
        </h2>


        {urgentTasks.length > 0 ? (

          <SortableTaskList
            tasks={urgentTasks}
          />

        ) : (

          <p className="text-gray-400">
            目前沒有今天到期任務
          </p>

        )}


        {/* 每日任務 */}

        <h2 className="mb-3 mt-8 text-xl font-bold">
          🔁 每日任務
        </h2>


        {dailyTasks.length > 0 ? (

          <SortableTaskList
            tasks={dailyTasks}
          />

        ) : (

          <p className="text-gray-400">
            目前沒有每日任務
          </p>

        )}


        {/* 連鎖任務 */}

        <h2 className="mb-3 mt-8 text-xl font-bold">
          🔗 連鎖任務
        </h2>


       {activeChains.length === 0 ? (

          <p className="text-gray-400">
            目前沒有連鎖任務
          </p>

        ) : (

          <div className="space-y-4">

            {activeChains.map(chain=>(

              <section
                key={chain.id}
                className="rounded-3xl bg-white p-5 shadow"
              >


                <div className="flex items-start justify-between gap-3">


                  <div className="min-w-0 flex-1">

                    <h3 className="break-words text-xl font-bold">
                      🔗 {chain.title}
                    </h3>


                    <p className="mt-2 text-sm text-gray-500">

                      {getIcon(chain.assign_to)}

                      {" "}

                      {chain.assign_to}

                    </p>

                  </div>


                  <span className="shrink-0 rounded-full bg-[#fff5dc] px-3 py-1 text-sm font-bold">

                    {chain.completedCount}
                    /
                    {chain.totalCount}

                  </span>

                </div>


                {/* 進度條 */}

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className="h-full rounded-full bg-black"
                    style={{
                      width:
                        chain.totalCount > 0
                          ? `${(chain.completedCount / chain.totalCount) * 100}%`
                          : "0%",
                    }}
                  />

                </div>


                {chain.allCompleted ? (

                  <div className="mt-4 rounded-2xl bg-green-50 p-3">

                    <p className="font-bold text-green-700">
                      🎉 連鎖任務全部完成
                    </p>

                  </div>

                ) : chain.currentTask ? (

                  <Link
                    href={`/tasks/${chain.currentTask.id}`}
                    className="mt-4 block rounded-2xl bg-[#fff5dc] p-4"
                  >

                    <p className="text-xs text-gray-500">
                      目前關卡
                    </p>


                    <p className="mt-1 font-bold">

                      第 {chain.currentTask.chain_step} 關：

                      {chain.currentTask.title}

                    </p>


                    {!chain.currentTask.due_at && (

                      <p className="mt-2 text-sm text-orange-500">
                        ⏰ 尚未設定本關期限
                      </p>

                    )}

                  </Link>

                ) : (

                  <div className="mt-4 rounded-2xl bg-gray-100 p-3 text-sm text-gray-500">

                    🔒 等待下一關解鎖

                  </div>

                )}


                {/* 關卡簡表 */}

                <div className="mt-4 space-y-2">

                  {chain.tasks.map((task:any)=>(

                    <Link
                      key={task.id}
                      href={`/tasks/${task.id}`}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm"
                    >

                      <span className="min-w-0 truncate">

                        {task.status === "已完成"
                          ? "✅"
                          : task.is_locked
                          ? "🔒"
                          : "▶️"}

                        {" "}

                        {task.chain_step}. {task.title}

                      </span>


                      <span className="shrink-0 text-gray-400">

                        🪙{task.reward}

                      </span>

                    </Link>

                  ))}

                </div>


              </section>

            ))}

          </div>

        )}


        {/* 一般任務 */}

        <h2 className="mb-3 mt-8 text-xl font-bold">
          📋 一般任務
        </h2>


        {normalTasks.length > 0 ? (

          <SortableTaskList
            tasks={normalTasks}
          />

        ) : (

          <p className="text-gray-400">
            目前沒有一般任務
          </p>

        )}


                {/* 已完成 */}

        <h2 className="mb-3 mt-8 text-xl font-bold">
          ✅ 已完成任務
        </h2>


        {
          completedItems.length > 0
          ? (

            <SortableCompletedList
              initialItems={completedItems}
            />

          )
          : (

            <p className="text-gray-400">
              目前沒有已完成任務
            </p>

          )
        }


      </div>


      <BottomNav />

    </main>

  );

}