import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;


    // =====================
    // 取得兌換人
    // =====================

    const body = await request.json();

    const user = body.user;


    if (
      user !== "阿寶" &&
      user !== "國王老師"
    ) {

      return NextResponse.json(
        {
          error: "無效的兌換身分",
        },
        {
          status: 400,
        }
      );

    }



    // =====================
    // 取得商品
    // =====================

    const {
      data: item,
      error: itemError,
    } = await supabase

      .from("shop_items")

      .select("*")

      .eq("id", id)

      .single();


    if (itemError || !item) {

      return NextResponse.json(
        {
          error: itemError?.message ?? "找不到商品",
        },
        {
          status: 404,
        }
      );

    }



    // =====================
    // 取得使用者錢包
    // =====================

    const {
      data: wallet,
      error: walletError,
    } = await supabase

      .from("wallets")

      .select("*")

      .eq("user_name", user)

      .single();


    if (walletError || !wallet) {

      return NextResponse.json(
        {
          error: walletError?.message ?? "找不到錢包",
        },
        {
          status: 500,
        }
      );

    }



    const currentBalance =
      Number(wallet.balance ?? 0);

    const price =
      Number(item.price ?? 0);



    // =====================
    // 餘額不足
    // =====================

    if (currentBalance < price) {

      return NextResponse.json(
        {
          error: `${user} 的阿寶幣不足`,
        },
        {
          status: 400,
        }
      );

    }



    // =====================
    // 扣除錢包餘額
    // =====================

    const {
      error: updateError,
    } = await supabase

      .from("wallets")

      .update({
        balance: currentBalance - price,
      })

      .eq("id", wallet.id);


    if (updateError) {

      return NextResponse.json(
        {
          error: updateError.message,
        },
        {
          status: 500,
        }
      );

    }



    // =====================
    // 建立商城兌換紀錄
    // =====================

    const {
      data: shopRecord,
      error: recordError,
    } = await supabase

      .from("shop_records")

      .insert([
        {
          user_name: user,
          item_name: item.name,
          price: price,
        },
      ])

      .select()

      .single();


    if (recordError) {

      return NextResponse.json(
        {
          error: recordError.message,
        },
        {
          status: 500,
        }
      );

    }



    // =====================
    // 建立錢包交易紀錄
    // =====================

    const {
      error: transactionError,
    } = await supabase

      .from("wallet_transactions")

      .insert([
        {
          user_name: user,

          amount: -price,

          transaction_type: "shop",

          description: `商城兌換：${item.name}`,

          shop_record_id: shopRecord?.id ?? null,
        },
      ]);


    if (transactionError) {

      return NextResponse.json(
        {
          error: transactionError.message,
        },
        {
          status: 500,
        }
      );

    }



    return NextResponse.json({

      success: true,

      message: `${user} 成功兌換「${item.name}」`,

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