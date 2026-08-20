import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {

  try {

    const { id } = await params;

    const body = await request.json();


    const {
      action,
      comment,
      reviewer,
    } = body;



    // =====================
    // 基本檢查
    // =====================

    if (
      action !== "approve" &&
      action !== "reject"
    ) {

      return NextResponse.json(
        {
          error: "未知操作",
        },
        {
          status: 400,
        }
      );

    }


    if (
      reviewer !== "阿寶" &&
      reviewer !== "國王老師"
    ) {

      return NextResponse.json(
        {
          error: "無效的審核身分",
        },
        {
          status: 400,
        }
      );

    }



    // =====================
    // 取得任務
    // =====================

    const {
      data: task,
      error: taskError,
    } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();


    if (taskError || !task) {

      return NextResponse.json(
        {
          error: "找不到任務",
        },
        {
          status: 404,
        }
      );

    }



    // =====================
    // 驗證審核者
    // =====================

    if (!task.created_by) {

      return NextResponse.json(
        {
          error: "此任務沒有建立者資料",
        },
        {
          status: 400,
        }
      );

    }


    if (reviewer !== task.created_by) {

      return NextResponse.json(
        {
          error: "你不是這個任務的建立者，無法審核",
        },
        {
          status: 403,
        }
      );

    }



    // =====================
    // 只能審核等待核可
    // =====================

    if (task.status !== "等待核可") {

      return NextResponse.json(
        {
          error: `目前任務狀態為「${task.status}」，無法審核`,
        },
        {
          status: 400,
        }
      );

    }



    // =====================
    // 核可
    // =====================

    if (action === "approve") {


      // ---------------------
      // 檢查是否發過獎勵
      // ---------------------

      const {
        data: existingTransaction,
        error: transactionCheckError,
      } = await supabase
        .from("wallet_transactions")
        .select("id")
        .eq("task_id", task.id)
        .eq("transaction_type", "task_reward")
        .maybeSingle();


      if (transactionCheckError) {

        return NextResponse.json(
          {
            error: transactionCheckError.message,
          },
          {
            status: 500,
          }
        );

      }


      if (existingTransaction) {

        return NextResponse.json(
          {
            error: "這個任務的獎勵已經發放過了",
          },
          {
            status: 400,
          }
        );

      }



      // ---------------------
      // 找執行者錢包
      // ---------------------

      const {
        data: wallet,
        error: walletError,
      } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_name", task.assign_to)
        .single();


      if (walletError || !wallet) {

        return NextResponse.json(
          {
            error: "找不到任務執行者的錢包",
          },
          {
            status: 500,
          }
        );

      }


      const reward =
        Number(task.reward ?? 0);

      const currentBalance =
        Number(wallet.balance ?? 0);



      // ---------------------
      // 新增交易紀錄
      // ---------------------

      const {
        error: transactionError,
      } = await supabase
        .from("wallet_transactions")
        .insert([
          {
            user_name: task.assign_to,

            amount: reward,

            transaction_type: "task_reward",

            description: `完成任務：${task.title}`,

            task_id: task.id,
          },
        ]);


      if (transactionError) {

        return NextResponse.json(
          {
            error: transactionError.message,
          },
          {
            status: 500,
          }
        );

      }



      // ---------------------
      // 更新錢包餘額
      // ---------------------

      const {
        error: walletUpdateError,
      } = await supabase
        .from("wallets")
        .update({
          balance:
            currentBalance + reward,
        })
        .eq(
          "user_name",
          task.assign_to
        );


      if (walletUpdateError) {

        return NextResponse.json(
          {
            error: walletUpdateError.message,
          },
          {
            status: 500,
          }
        );

      }



      // ---------------------
      // 任務改為已完成
      // ---------------------

      const completedAt =
  new Date().toISOString();


const {
  error: taskUpdateError,
} = await supabase
  .from("tasks")
  .update({
    status: "已完成",

    updated_at:
      completedAt,

    completed_at:
      completedAt,
  })
  .eq("id", id)
  .eq("status", "等待核可");


      if (taskUpdateError) {

        return NextResponse.json(
          {
            error: taskUpdateError.message,
          },
          {
            status: 500,
          }
        );

      }



      // =====================
      // 連鎖任務：解鎖下一關
      // =====================

      let nextTask = null;

      let chainCompleted = false;


      if (
        task.chain_id &&
        task.chain_step
      ) {


        const {
          data: next,
          error: nextTaskError,
        } = await supabase
          .from("tasks")
          .select("*")
          .eq(
            "chain_id",
            task.chain_id
          )
          .eq(
            "chain_step",
            Number(
              task.chain_step
            ) + 1
          )
          .maybeSingle();



        if (nextTaskError) {

          return NextResponse.json(
            {
              error:
                nextTaskError.message,
            },
            {
              status: 500,
            }
          );

        }



        // 有下一關
        if (next) {


          const {
            data: unlockedTask,
            error: unlockError,
          } = await supabase
            .from("tasks")
            .update({
              is_locked: false,

              // 解鎖時仍沒有期限
              due_at: null,

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              next.id
            )
            .select()
            .single();



          if (unlockError) {

            return NextResponse.json(
              {
                error:
                  unlockError.message,
              },
              {
                status: 500,
              }
            );

          }


          nextTask =
            unlockedTask;


          // 下一關聊天室留系統訊息
          await supabase
            .from("task_comments")
            .insert([
              {
                task_id:
                  next.id,

                user_name:
                  "系統",

                content:
                  `🔓 第 ${next.chain_step} 關已解鎖，請設定截止時間`,

                message_type:
                  "system",
              },
            ]);


                } else {

          // =====================
          // 沒有下一關
          // = 整條連鎖任務完成
          // =====================

          chainCompleted = true;


          const {
            error: chainCompleteError,
          } = await supabase
            .from("task_chains")
            .update({
              completed_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              task.chain_id
            );


          if (chainCompleteError) {

            return NextResponse.json(
              {
                error:
                  chainCompleteError.message,
              },
              {
                status: 500,
              }
            );

          }

        }

      }



      // ---------------------
      // 本關聊天室系統訊息
      // ---------------------

      await supabase
        .from("task_comments")
        .insert([
          {
            task_id: task.id,

            user_name: reviewer,

            content: comment
              ? `${reviewer} 核可：${comment}`
              : `${reviewer} 已核可任務`,

            message_type: "system",
          },
        ]);



      // =====================
      // 回傳結果
      // =====================

      if (chainCompleted) {

        return NextResponse.json({

          success: true,

          chain_completed: true,

          message:
            `🎉 連鎖任務全部完成！${task.assign_to} 獲得 ${reward} 阿寶幣`,

        });

      }


      if (nextTask) {

        return NextResponse.json({

          success: true,

          next_task:
            nextTask,

          message:
            `任務已完成，${task.assign_to} 獲得 ${reward} 阿寶幣，第 ${nextTask.chain_step} 關已解鎖`,

        });

      }



      return NextResponse.json({

        success: true,

        message:
          `任務已完成，${task.assign_to} 獲得 ${reward} 阿寶幣`,

      });

    }



    // =====================
    // 退回
    // =====================

    if (action === "reject") {

      const {
        error: rejectError,
      } = await supabase
        .from("tasks")
        .update({
          status: "已退回",

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
        .eq(
          "status",
          "等待核可"
        );


      if (rejectError) {

        return NextResponse.json(
          {
            error:
              rejectError.message,
          },
          {
            status: 500,
          }
        );

      }



      await supabase
        .from("task_comments")
        .insert([
          {
            task_id:
              task.id,

            user_name:
              reviewer,

            content: comment
              ? `${reviewer} 退回原因：${comment}`
              : `${reviewer} 退回任務，請重新完成`,

            message_type:
              "system",
          },
        ]);



      return NextResponse.json({

        success: true,

        message:
          "任務已退回",

      });

    }



    return NextResponse.json(
      {
        error: "未知操作",
      },
      {
        status: 400,
      }
    );


  } catch (error) {

    console.error(error);


    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );

  }

}