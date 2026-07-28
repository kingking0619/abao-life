import CompleteButton from "@/components/CompleteButton";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function TasksPage() {


  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", {
      ascending: false,
    });


  if (error) {
    console.log(error);
  }



  return (
    <main className="min-h-screen bg-[#fffaf2] p-5 text-gray-800">

      <div className="mx-auto max-w-md">


        <h1 className="mb-6 text-3xl font-bold">
          📋 任務
        </h1>


        <Link
  href="/tasks/new"
  className="mb-5 block w-full rounded-3xl bg-black p-4 text-center text-white"
>
  ＋ 新增任務
</Link>



        {/* 進行中任務 */}

        <h2 className="mb-3 text-xl font-bold">
          📋 進行中任務
        </h2>


        <div className="space-y-4">

          {tasks
            ?.filter((task) => task.status !== "已完成")
            .map((task) => (

              <div
                key={task.id}
                className="rounded-3xl bg-white p-5 shadow"
              >


                <div className="flex justify-between">

                  <h2 className="text-lg font-bold">
                    {task.title}
                  </h2>


                  <span className="font-bold">
                    🪙 {task.reward}
                  </span>

                </div>



                <p className="mt-2 text-gray-500">
                  指派給：{task.assign_to}
                </p>



                <p className="mt-2 text-sm">
                  狀態：{task.status}
                </p>



                <CompleteButton id={task.id} />


              </div>

          ))}


        </div>




        {/* 已完成任務 */}

        <h2 className="mb-3 mt-8 text-xl font-bold">
          ✅ 已完成任務
        </h2>



        <div className="space-y-4">


          {tasks
            ?.filter((task) => task.status === "已完成")
            .map((task) => (

              <div
                key={task.id}
                className="rounded-3xl bg-gray-100 p-5 shadow"
              >


                <div className="flex justify-between">

                  <h2 className="text-lg font-bold">
                    {task.title}
                  </h2>


                  <span className="font-bold">
                    🪙 {task.reward}
                  </span>

                </div>



                <p className="mt-2 text-gray-500">
                  指派給：{task.assign_to}
                </p>



                <p className="mt-2 text-sm text-gray-600">
                  狀態：已完成
                </p>


              </div>

          ))}


        </div>


      </div>


      <BottomNav />

    </main>
  );
}