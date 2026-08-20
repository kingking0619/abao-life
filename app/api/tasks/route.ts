import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function POST(request: Request) {

  try {

    const body = await request.json();


    const {
      title,
      description,
      created_by,
      assign_to,
      reward,
      due_at,
      penalty,
      is_daily,
      task_mode,
      status,
    } = body;




    const { data, error } = await supabase

      .from("tasks")

      .insert([

        {
          title,

          description,

          created_by,

          assign_to,

          reward,

          due_at,

          penalty,

          is_daily,

          task_mode,

          status,
        }

      ])

      .select();




    if (error) {

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );

    }




    return NextResponse.json({

      success: true,

      task: data?.[0],

    });




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