import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  const { data: comments, error: commentsError } = await supabase
    .from("task_comments")
    .select("*")
    .eq("task_id", id)
    .order("created_at", {
      ascending: true,
    });

  const { data: logs, error: logsError } = await supabase
    .from("task_logs")
    .select("*")
    .eq("task_id", id)
    .order("created_at", {
      ascending: false,
    });

  if (taskError) {
    console.log("任務錯誤:", taskError);
  }

  if (commentsError) {
    console.log("留言錯誤:", commentsError);
  }

  if (logsError) {
    console.log("歷程錯誤:", logsError);
  }

  if (!task) {
    return (
      <main className="min-h-screen bg-[#fffaf2] p-5 text-gray-800">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold">
            找不到這個任務
          </h1>

          <Link
            href="/tasks"
            className="mt-5 block text-gray-500"
          >
            ← 返回任務
          </Link>
        </div>

        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf2] p-5 text-gray-800">
      <div className="mx-auto max-w-md">

        <Link
          href="/tasks"
          className="mb-5 block text-gray-500"
        >
          ← 返回任務
        </Link>

        {/* 任務資訊 */}
        <section className="rounded-3xl bg-white p-5 shadow">

          <h1 className="text-2xl font-bold">
            {task.title}
          </h1>

          <p className="mt-3 text-gray-500">
            指派給：{task.assign_to}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-[#fff5dc] p-4">
              <p className="text-sm text-gray-500">
                獎勵
              </p>

              <p className="mt-1 text-xl font-bold">
                🪙 +{task.reward}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fff5dc] p-4">
              <p className="text-sm text-gray-500">
                逾期扣除
              </p>

              <p className="mt-1 text-xl font-bold">
                🪙 -{task.penalty ?? 0}
              </p>
            </div>

          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              截止時間
            </p>

            <p className="mt-1 font-bold">
              {task.due_at
                ? new Date(task.due_at).toLocaleString("zh-TW")
                : "尚未設定"}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              狀態
            </p>

            <p className="mt-1 font-bold">
              {task.status}
            </p>
          </div>

        </section>

        {/* 任務內容 */}
        <section className="mt-5 rounded-3xl bg-white p-5 shadow">

          <h2 className="text-lg font-bold">
            📝 任務內容
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-gray-700">
            {task.description || "尚未補充任務內容"}
          </p>

        </section>

        {/* 留言 */}
        <section className="mt-5 rounded-3xl bg-white p-5 shadow">

          <h2 className="text-lg font-bold">
            💬 留言
          </h2>

          <div className="mt-4 space-y-3">

            {comments?.length ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl bg-gray-100 p-4"
                >
                  <p className="font-bold">
                    {comment.user_name}
                  </p>

                  <p className="mt-1 text-gray-700">
                    {comment.content}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(
                      comment.created_at
                    ).toLocaleString("zh-TW")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                目前還沒有留言
              </p>
            )}

          </div>

        </section>

        {/* 任務歷程 */}
        <section className="mt-5 rounded-3xl bg-white p-5 shadow">

          <h2 className="text-lg font-bold">
            📜 任務歷程
          </h2>

          <div className="mt-4 space-y-3">

            {logs?.length ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-2xl bg-gray-100 p-4"
                >
                  <p className="font-bold">
                    {log.user_name}
                  </p>

                  <p className="mt-1">
                    {log.action}
                  </p>

                  {log.comment && (
                    <p className="mt-1 text-gray-600">
                      「{log.comment}」
                    </p>
                  )}

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(
                      log.created_at
                    ).toLocaleString("zh-TW")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                目前還沒有歷程
              </p>
            )}

          </div>

        </section>

      </div>

      <BottomNav />
    </main>
  );
}
