import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("收到資料:", body);

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: body.title,
          assign_to: body.assign_to,
          reward: body.reward,
          status: body.status,
        },
      ])
      .select();

    console.log("Supabase結果:", data, error);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {

    console.log("真正錯誤:", error);

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}