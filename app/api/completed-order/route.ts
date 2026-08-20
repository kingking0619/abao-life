import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function PATCH(
  request: Request
) {

  try {

    const body =
      await request.json();


    const items =
      body.items;


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


      // =====================
      // 一般任務
      // =====================

      if (item.type === "task") {

        const rawId =
          String(item.id).replace(
            "task-",
            ""
          );


        const {
          error,
        } = await supabase
          .from("tasks")
          .update({
            completed_sort_order:
              item.sort_order,
          })
          .eq(
            "id",
            rawId
          );


        if (error) {

          return NextResponse.json(
            {
              error:
                error.message,
            },
            {
              status: 500,
            }
          );

        }

      }



      // =====================
      // 連鎖任務
      // =====================

      if (item.type === "chain") {

        const rawId =
          String(item.id).replace(
            "chain-",
            ""
          );


        const {
          error,
        } = await supabase
          .from("task_chains")
          .update({
            completed_sort_order:
              item.sort_order,
          })
          .eq(
            "id",
            rawId
          );


        if (error) {

          return NextResponse.json(
            {
              error:
                error.message,
            },
            {
              status: 500,
            }
          );

        }

      }

    }


    return NextResponse.json({
      success: true,
    });


  } catch (error) {

    return NextResponse.json(
      {
        error:
          String(error),
      },
      {
        status: 500,
      }
    );

  }

}