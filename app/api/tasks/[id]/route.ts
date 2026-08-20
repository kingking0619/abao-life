import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendLineMessage } from "@/lib/line";





// =========================
// GET 取得單一任務
// =========================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {


  try {


    const { id } = await params;



    const { data: task, error } = await supabase

      .from("tasks")

      .select("*")

      .eq("id", id)

      .single();





    if(error){


      return NextResponse.json(

        {
          error:error.message,
        },

        {
          status:500,
        }

      );


    }





    return NextResponse.json({

      task,

    });





  } catch(error){


    return NextResponse.json(

      {
        error:String(error),
      },

      {
        status:500,
      }

    );


  }


}









// =========================
// PATCH 更新任務
// =========================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {


  try {


    const { id } = await params;


    const body = await request.json();






    const { data: task, error: taskError } = await supabase

      .from("tasks")

      .select("*")

      .eq("id", id)

      .single();






    if(taskError){


      return NextResponse.json(

        {
          error:taskError.message,
        },

        {
          status:500,
        }

      );


    }









    // =========================
// 完成回報 / 重新提交
// =========================

if(body.action === "complete"){


  // 原本是已退回
  // 代表這次是重新提交
  const isResubmit =
    task.status === "已退回";



  const { error } = await supabase

    .from("tasks")

    .update({

      status:"等待核可",

      updated_at:new Date().toISOString(),

    })

    .eq("id",id);





  if(error){


    return NextResponse.json(

      {
        error:error.message,
      },

      {
        status:500,
      }

    );


  }





  // =========================
  // 聊天室系統訊息
  // =========================

  await supabase

    .from("task_comments")

    .insert([

      {

        task_id:task.id,

        user_name:task.assign_to,

        content:
          isResubmit
            ? "已重新提交，等待核可"
            : "已回報完成，等待核可",

        message_type:"system",

      }

    ]);





  // =========================
  // LINE 通知建立者
  // =========================

  try {


    const appUrl =
      "https://abao-life-orcin.vercel.app";


    if(isResubmit){


      await sendLineMessage(

        task.created_by,

        `🔄 任務重新提交

${task.assign_to} 已重新提交任務：

📋 ${task.title}

請再次進行核可。

${appUrl}/tasks/${task.id}`

      );


    }else{


      await sendLineMessage(

        task.created_by,

        `✅ 任務回報完成

${task.assign_to} 已完成任務：

📋 ${task.title}

請進行核可。

${appUrl}/tasks/${task.id}`

      );


    }


  }catch(lineError){


    // LINE 發送失敗
    // 不影響任務本身的回報

    console.error(
      "LINE 通知失敗:",
      lineError
    );


  }





  return NextResponse.json({

    success:true,

    message:
      isResubmit
        ? "已重新提交核可"
        : "已送出核可申請",

  });



}









    // =========================
    // 編輯任務
    // =========================


    const {

      title,

      description,

      assign_to,

      reward,

      due_at,

      penalty,

    } = body;






    const { error:updateError } = await supabase

      .from("tasks")

      .update({

        title,

        description,

        assign_to,

        reward,

        due_at,

        penalty,

        updated_at:new Date().toISOString(),

      })

      .eq("id",id);







    if(updateError){


      return NextResponse.json(

        {
          error:updateError.message,
        },

        {
          status:500,
        }

      );


    }






    return NextResponse.json({

      success:true,

      message:"任務修改成功",

    });







  } catch(error){



    return NextResponse.json(

      {
        error:String(error),
      },

      {
        status:500,
      }

    );


  }


}









// =========================
// DELETE 刪除任務
// =========================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {


  try {


    const { id } = await params;





    // 先刪除聊天室訊息

    const { error: commentError } = await supabase

      .from("task_comments")

      .delete()

      .eq("task_id", id);







    if(commentError){


      return NextResponse.json(

        {
          error:commentError.message,
        },

        {
          status:500,
        }

      );


    }








    // 再刪除任務

    const { error: taskError } = await supabase

      .from("tasks")

      .delete()

      .eq("id", id);







    if(taskError){


      return NextResponse.json(

        {
          error:taskError.message,
        },

        {
          status:500,
        }

      );


    }







    return NextResponse.json({

      success:true,

      message:"任務已刪除",

    });






  } catch(error){



    return NextResponse.json(

      {
        error:String(error),
      },

      {
        status:500,
      }

    );


  }


}