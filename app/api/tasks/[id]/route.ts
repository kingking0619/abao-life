import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";




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
    // 完成回報
    // =========================


    if(body.action === "complete"){



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







      await supabase

        .from("task_comments")

        .insert([

          {

            task_id:task.id,

            user_name:task.assign_to,

            content:"已回報完成，等待核可",

            message_type:"system",

          }

        ]);






      return NextResponse.json({

        success:true,

        message:"已送出核可申請",

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