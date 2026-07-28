import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    // 取得兌換人
    const body = await request.json();

    const user = body.user;



    // 取得商品
    const { data: item, error: itemError } = await supabase
      .from("shop_items")
      .select("*")
      .eq("id", id)
      .single();


    if (itemError) {
      return NextResponse.json(
        { error: itemError.message },
        { status: 500 }
      );
    }



    // 取得指定使用者錢包
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_name", user)
      .single();



    if (walletError) {
      return NextResponse.json(
        { error: walletError.message },
        { status: 500 }
      );
    }



    // 錢不夠
    if (wallet.balance < item.price) {

      return NextResponse.json(
        {
          error: `${user} 的阿寶幣不足`,
        },
        {
          status: 400,
        }
      );

    }



    // 扣除錢包餘額
    const { error: updateError } = await supabase
      .from("wallets")
      .update({
        balance: wallet.balance - item.price,
      })
      .eq("id", wallet.id);



    if (updateError) {

      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );

    }



    // 建立兌換紀錄
    const { error: recordError } = await supabase
      .from("shop_records")
      .insert([
        {
          user_name: user,
          item_name: item.name,
          price: item.price,
        },
      ]);



    if (recordError) {

      return NextResponse.json(
        { error: recordError.message },
        { status: 500 }
      );

    }



    return NextResponse.json({
      success: true,
      message: `${user} 兌換成功`,
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