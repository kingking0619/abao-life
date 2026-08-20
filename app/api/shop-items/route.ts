import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function GET() {

  const { data, error } = await supabase
    .from("shop_items")
    .select("*")
    .order("id", {
      ascending: true,
    });


  if (error) {

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }


  return NextResponse.json(data ?? []);

}



export async function POST(request: Request) {

  try {

    const body = await request.json();


    const {
      name,
      price,
      description,
    } = body;


    if (!name?.trim()) {

      return NextResponse.json(
        {
          error: "請輸入獎勵名稱",
        },
        {
          status: 400,
        }
      );

    }


    const itemPrice = Number(price);


    if (
      !Number.isFinite(itemPrice) ||
      itemPrice < 0
    ) {

      return NextResponse.json(
        {
          error: "請輸入有效的阿寶幣價格",
        },
        {
          status: 400,
        }
      );

    }


    const {
      data,
      error,
    } = await supabase
      .from("shop_items")
      .insert([
        {
          name: name.trim(),
          price: itemPrice,
          description:
            description?.trim() ?? "",
          is_active: true,
        },
      ])
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


    return NextResponse.json(
      {
        success: true,
        item: data,
      },
      {
        status: 201,
      }
    );


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