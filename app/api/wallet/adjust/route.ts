import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function POST(request: Request) {

  try {

    const body = await request.json();

    const {
      user,
      amount,
      reason,
    } = body;


    // =====================
    // 驗證身分
    // =====================

    if (
      user !== "阿寶" &&
      user !== "國王老師"
    ) {

      return NextResponse.json(
        {
          error: "無效的使用者",
        },
        {
          status: 400,
        }
      );

    }



    const adjustAmount = Number(amount);


    // =====================
    // 驗證金額
    // =====================

    if (
      !Number.isFinite(adjustAmount) ||
      adjustAmount === 0
    ) {

      return NextResponse.json(
        {
          error: "請輸入有效的調整金額",
        },
        {
          status: 400,
        }
      );

    }



    // =====================
    // 取得錢包
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
          error: "找不到錢包",
        },
        {
          status: 404,
        }
      );

    }



    const currentBalance =
      Number(wallet.balance ?? 0);

    const newBalance =
      currentBalance + adjustAmount;



    // =====================
    // 不允許變負數
    // =====================

    if (newBalance < 0) {

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
    // 更新餘額
    // =====================

    const {
      error: updateError,
    } = await supabase
      .from("wallets")
      .update({
        balance: newBalance,
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
    // 建立交易紀錄
    // =====================

    const {
      error: transactionError,
    } = await supabase
      .from("wallet_transactions")
      .insert([
        {
          user_name: user,

          amount: adjustAmount,

          transaction_type: "adjustment",

          description:
            reason?.trim()
              ? `手動調整：${reason.trim()}`
              : "手動調整",
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

      balance: newBalance,

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