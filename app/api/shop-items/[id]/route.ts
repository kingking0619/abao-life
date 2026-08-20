import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id:string }>;
  }
) {

  const { id } = await params;


  const {
    data,
    error,
  } = await supabase
    .from("shop_items")
    .select("*")
    .eq("id",id)
    .single();


  if(error || !data){

    return NextResponse.json(
      {
        error:"找不到獎勵",
      },
      {
        status:404,
      }
    );

  }


  return NextResponse.json(data);

}




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

    const body =
      await request.json();


    const {
      name,
      price,
      description,
    } = body;



    if(!name?.trim()){

      return NextResponse.json(
        {
          error:"請輸入獎勵名稱",
        },
        {
          status:400,
        }
      );

    }


    const itemPrice =
      Number(price);


    if(
      !Number.isFinite(itemPrice)
      ||
      itemPrice < 0
    ){

      return NextResponse.json(
        {
          error:"請輸入有效的阿寶幣價格",
        },
        {
          status:400,
        }
      );

    }



    const {
      data,
      error,
    } = await supabase
      .from("shop_items")
      .update({
        name:name.trim(),
        price:itemPrice,
        description:
          description?.trim() ?? "",
      })
      .eq("id",id)
      .select()
      .single();



    if(error){

      return NextResponse.json(
        {
          error:error.message,
        },
        {
          status:500,
        }
      );

    }


    return NextResponse.json({
      success:true,
      item:data,
    });


  } catch(error){

    return NextResponse.json(
      {
        error:String(error),
      },
      {
        status:500,
      }
    );

  }

}




export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id:string }>;
  }
) {

  try {

    const { id } = await params;


    const {
      error,
    } = await supabase
      .from("shop_items")
      .delete()
      .eq("id",id);


    if(error){

      return NextResponse.json(
        {
          error:error.message,
        },
        {
          status:500,
        }
      );

    }


    return NextResponse.json({
      success:true,
    });


  } catch(error){

    return NextResponse.json(
      {
        error:String(error),
      },
      {
        status:500,
      }
    );

  }

}