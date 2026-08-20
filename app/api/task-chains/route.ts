import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();


    const {
      title,
      description,
      created_by,
      assign_to,
      steps,
    } = body;



    if (!title?.trim()) {

      return NextResponse.json(
        {
          error: "請輸入連鎖任務名稱",
        },
        {
          status: 400,
        }
      );

    }


    if (
      created_by !== "阿寶" &&
      created_by !== "國王老師"
    ) {

      return NextResponse.json(
        {
          error: "建立者身分錯誤",
        },
        {
          status: 400,
        }
      );

    }


    if (
      assign_to !== "阿寶" &&
      assign_to !== "國王老師"
    ) {

      return NextResponse.json(
        {
          error: "指派者身分錯誤",
        },
        {
          status: 400,
        }
      );

    }


    if (
      !Array.isArray(steps) ||
      steps.length < 2
    ) {

      return NextResponse.json(
        {
          error: "連鎖任務至少需要 2 關",
        },
        {
          status: 400,
        }
      );

    }



    // =====================
    // 驗證每一關
    // =====================

    for (
      let index = 0;
      index < steps.length;
      index++
    ) {

      const step =
        steps[index];


      if (!step.title?.trim()) {

        return NextResponse.json(
          {
            error:
              `第 ${index + 1} 關沒有任務名稱`,
          },
          {
            status: 400,
          }
        );

      }


      const reward =
        Number(step.reward);


      if (
        !Number.isFinite(reward) ||
        reward < 0
      ) {

        return NextResponse.json(
          {
            error:
              `第 ${index + 1} 關獎勵格式錯誤`,
          },
          {
            status: 400,
          }
        );

      }

    }



    // =====================
    // 建立主連鎖任務
    // =====================

    const {
      data: chain,
      error: chainError,
    } = await supabase
      .from("task_chains")
      .insert([
        {
          title:
            title.trim(),

          description:
            description?.trim() ?? "",

          created_by,

          assign_to,
        },
      ])
      .select()
      .single();



    if (
      chainError ||
      !chain
    ) {

      return NextResponse.json(
        {
          error:
            chainError?.message ??
            "建立連鎖任務失敗",
        },
        {
          status: 500,
        }
      );

    }



    // =====================
    // 建立每一關
    // =====================

    const taskRows =
  steps.map(
    (
      step: any,
      index: number
    ) => {

      return {

        title:
          step.title.trim(),

        description:
          step.description?.trim() ?? "",

        created_by,

        assign_to,

        reward:
          Number(
            step.reward ?? 0
          ),

        // 只有第一關建立時有期限
        due_at:
          index === 0 && step.due_at
            ? new Date(
                step.due_at
              ).toISOString()
            : null,

        // 只有第一關建立時有逾期扣除
        penalty:
          index === 0
            ? Number(
                step.penalty ?? 0
              )
            : 0,

        is_daily:
          false,

        task_mode:
          "連鎖任務",

        status:
          "待完成",

        chain_id:
          chain.id,

        chain_step:
          index + 1,

        // 第一關立即開放
        // 其餘等上一關核可
        is_locked:
          index !== 0,

        sort_order:
          index,

      };

    }
  );



    const {
      data: tasks,
      error: tasksError,
    } = await supabase
      .from("tasks")
      .insert(
        taskRows
      )
      .select();



    if (tasksError) {

      // 如果關卡建立失敗
      // 把剛建立的主連鎖任務刪掉
      await supabase
        .from("task_chains")
        .delete()
        .eq(
          "id",
          chain.id
        );


      return NextResponse.json(
        {
          error:
            tasksError.message,
        },
        {
          status: 500,
        }
      );

    }



    return NextResponse.json(
      {
        success: true,
        chain,
        tasks,
      },
      {
        status: 201,
      }
    );


  } catch (error) {

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