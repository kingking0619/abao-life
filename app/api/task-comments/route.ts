import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {

  try {

    const body = await request.json();

    const {
      task_id,
      user_name,
      content,
      message_type,
    } = body;


    const { error } = await supabase
      .from("task_comments")
      .insert([
        {
          task_id,
          user_name,
          content,
          message_type,
        },
      ]);


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