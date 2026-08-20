import UserSwitcher from "@/components/UserSwitcher";
import QuickCreateTask from "@/components/QuickCreateTask";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";


function getIcon(name: string){

  return name === "國王老師"
    ? "👑"
    : "🧸";

}



function isToday(date:string){

  const d = new Date(date);
  const today = new Date();


  return (

    d.getFullYear() === today.getFullYear()
    &&
    d.getMonth() === today.getMonth()
    &&
    d.getDate() === today.getDate()

  );

}






export default async function HomePage(){



  const { data: tasks } = await supabase

    .from("tasks")

    .select(`
      *,
      task_comments(
        content,
        user_name,
        created_at
      )
    `)

    .order(
      "created_at",
      {
        ascending:false
      }
    );







  const { data: wallets } = await supabase

    .from("wallets")

    .select("*");







  const allTasks = tasks ?? [];






  const waitingTasks = allTasks.filter(

    task => task.status === "等待核可"

  );






  const rejectedTasks = allTasks.filter(

    task => task.status === "已退回"

  );






  const pendingTasks = allTasks.filter(

    task =>
      task.status === "待完成"
      ||
      task.status === "等待核可"

  );






  const completedTasks = allTasks.filter(

    task => task.status === "已完成"

  );






  const todayTasks = allTasks.filter(

    task =>
      task.due_at
      &&
      isToday(task.due_at)

  );







  function getBalance(name:string){


    const wallet = wallets?.find(

      item => item.user_name === name

    );


    return wallet?.balance ?? 0;

  }







  function getRejectReason(task:any){


    const comments = task.task_comments ?? [];


    const last = comments[comments.length - 1];


    return last?.content ?? "未留下原因";


  }









  return (

    <main

      className="
      min-h-screen
      bg-[#fffaf2]
      p-5
      pb-28
      text-gray-800
      "

    >



      <div className="mx-auto max-w-md">







        <div className="mb-6 flex items-center justify-between gap-3">

  <h1 className="text-3xl font-bold leading-none">
    🏠 阿寶的理想生活
  </h1>


  <div className="flex items-center gap-2">

    <Link
      href="/search"
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
      title="搜尋"
    >
      🔎
    </Link>


    <UserSwitcher />

  </div>

</div>









        {/* 阿寶幣 */}

        <section className="rounded-3xl bg-white p-5 shadow">


          <h2 className="text-xl font-bold">

            🪙 阿寶幣

          </h2>



          <div className="mt-4 grid grid-cols-2 gap-3">


            <div className="rounded-2xl bg-[#fff5dc] p-4">

              <p>
                👑 國王老師
              </p>


              <p className="mt-2 text-3xl font-bold">

                {getBalance("國王老師")}

              </p>


            </div>






            <div className="rounded-2xl bg-[#fff5dc] p-4">


              <p>
                🧸 阿寶
              </p>


              <p className="mt-2 text-3xl font-bold">

                {getBalance("阿寶")}

              </p>


            </div>



          </div>


        </section>




        <div className="mt-5">
        <QuickCreateTask />
        </div>



        {/* 待確認 */}

        <section className="mt-5 rounded-3xl bg-white p-5 shadow">


          <h2 className="text-xl font-bold">

            📋 待確認

          </h2>



          <div className="mt-4 space-y-3">


          {

            waitingTasks.length === 0

            ?

            <p className="text-gray-400">

              目前沒有待確認任務

            </p>


            :


            waitingTasks.map(task=>(


              <Link

                key={task.id}

                href={`/tasks/${task.id}`}

                className="
                block
                rounded-2xl
                bg-[#fff5dc]
                p-4
                "

              >


                <p className="font-bold">

                  {getIcon(task.assign_to)}

                  {" "}

                  {task.title}

                </p>



                <p className="mt-2 text-sm">

                  ⏳ 等待核可

                </p>



                <p className="mt-1">

                  🪙 +{task.reward}

                </p>


              </Link>


            ))

          }


          </div>


        </section>









        {/* 被退回 */}

        <section className="mt-5 rounded-3xl bg-white p-5 shadow">


          <h2 className="text-xl font-bold">

            ↩️ 被退回

          </h2>



          <div className="mt-4 space-y-3">


          {

            rejectedTasks.length === 0

            ?

            <p className="text-gray-400">

              目前沒有退回任務

            </p>


            :


            rejectedTasks.map(task=>(


              <Link

                key={task.id}

                href={`/tasks/${task.id}`}

                className="
                block
                rounded-2xl
                bg-red-50
                p-4
                "

              >


                <p className="font-bold">

                  {getIcon(task.assign_to)}

                  {" "}

                  {task.title}

                </p>



                <p className="mt-2 text-sm text-red-500">

                  ↩️ {getRejectReason(task)}

                </p>



                <p className="mt-1">

                  🪙 +{task.reward}

                </p>


              </Link>


            ))

          }


          </div>


        </section>









        {/* 快速入口 */}

        <section className="mt-5 grid grid-cols-2 gap-3">


          <Link

            href="/tasks/new"

            className="
            rounded-3xl
            bg-black
            p-4
            text-center
            font-bold
            text-white
            "

          >

            ＋ 新增任務

          </Link>




          <Link

            href="/wallet"

            className="
            rounded-3xl
            bg-white
            p-4
            text-center
            font-bold
            shadow
            "

          >

            🪙 錢包

          </Link>


        </section>





      </div>



      <BottomNav/>


    </main>

  );

}