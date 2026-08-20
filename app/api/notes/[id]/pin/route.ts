import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id:string }>;
  }
) {

  try {

    const { id } = await params;

    const body = await request.json();

    const isPinned =
      Boolean(body.is_pinned);


    const {
      data,
      error,
    } = await supabase
      .from("notes")
      .update({
        is_pinned: isPinned,
      })
      .eq("id", id)
      .select()
      .single();


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
      note: data,
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