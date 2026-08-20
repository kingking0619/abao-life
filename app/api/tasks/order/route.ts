import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";



export async function PATCH(
  request: Request
) {


  try {


    const body = await request.json();



    const { tasks } = body;



    if(!tasks || !Array.isArray(tasks)){


      return NextResponse.json(

        {
          error:"排序資料錯誤",
        },

        {
          status:400,
        }

      );


    }






    for(const task of tasks){


      const { error } = await supabase

        .from("tasks")

        .update({

          sort_order:task.sort_order,

          updated_at:new Date().toISOString(),

        })

        .eq("id",task.id);





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


    }






    return NextResponse.json({

      success:true,

      message:"排序更新成功",

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