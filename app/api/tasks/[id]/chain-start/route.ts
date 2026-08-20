import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function PATCH(
  request:Request,
  {
    params,
  }:{
    params:Promise<{id:string}>;
  }
){

  try{

    const {id} =
      await params;


    const body =
      await request.json();


    const {
      due_at,
      penalty,
      user,
    } = body;



    const {
      data:task,
      error:taskError,
    } = await supabase
      .from("tasks")
      .select("*")
      .eq("id",id)
      .single();



    if(taskError || !task){

      return NextResponse.json(
        {
          error:"找不到任務",
        },
        {
          status:404,
        }
      );

    }



    // 必須是連鎖任務
    if(!task.chain_id){

      return NextResponse.json(
        {
          error:"這不是連鎖任務",
        },
        {
          status:400,
        }
      );

    }



    // 還鎖住不能設定
    if(task.is_locked){

      return NextResponse.json(
        {
          error:"這一關尚未解鎖",
        },
        {
          status:400,
        }
      );

    }



    // 只有建立者設定
    if(user !== task.created_by){

      return NextResponse.json(
        {
          error:"只有任務建立者可以設定期限",
        },
        {
          status:403,
        }
      );

    }



    // 已有期限就不要重設
    if(task.due_at){

      return NextResponse.json(
        {
          error:"這一關已經設定期限",
        },
        {
          status:400,
        }
      );

    }



    if(!due_at){

      return NextResponse.json(
        {
          error:"請設定截止時間",
        },
        {
          status:400,
        }
      );

    }



    const {
      error:updateError,
    } = await supabase
      .from("tasks")
      .update({
        due_at,
        penalty:
          Number(
            penalty ?? 0
          ),
        updated_at:
          new Date().toISOString(),
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



    await supabase
      .from("task_comments")
      .insert([
        {
          task_id:
            task.id,

          user_name:
            task.created_by,

          content:
            `⏰ 第 ${task.chain_step} 關已設定截止時間，可以開始任務`,

          message_type:
            "system",
        },
      ]);



    return NextResponse.json({
      success:true,
    });


  }catch(error){

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