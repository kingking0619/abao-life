import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;


    // 1. 先取得任務資料
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();


    if (taskError) {
      return NextResponse.json(
        { error: taskError.message },
        { status: 500 }
      );
    }



    // 2. 更新任務狀態
    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        status: "已完成",
      })
      .eq("id", id);


    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }



    // 3. 找到對應錢包
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_name", task.assign_to)
      .single();


    if (walletError) {
      return NextResponse.json(
        { error: walletError.message },
        { status: 500 }
      );
    }



    // 4. 增加阿寶幣
    const { error: balanceError } = await supabase
      .from("wallets")
      .update({
        balance: wallet.balance + task.reward,
      })
      .eq("id", wallet.id);



    if (balanceError) {
      return NextResponse.json(
        { error: balanceError.message },
        { status: 500 }
      );
    }



    return NextResponse.json({
      success: true,
      message: "任務完成，阿寶幣增加",
    });



  } catch (error) {

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );

  }

}