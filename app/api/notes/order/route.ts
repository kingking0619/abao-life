import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function PATCH(request: Request) {

  try {

    const body = await request.json();

    const items = body.items;


    if (!Array.isArray(items)) {

      return NextResponse.json(
        {
          error: "排序資料格式錯誤",
        },
        {
          status: 400,
        }
      );

    }


    for (const item of items) {

      const { error } = await supabase
        .from("notes")
        .update({
          sort_order: item.sort_order,
        })
        .eq("id", item.id);


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