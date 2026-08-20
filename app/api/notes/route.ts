import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";



// 取得全部記事
// GET /api/notes

export async function GET(){


  try{


    const {

      data:notes,

      error,

    } = await supabase

      .from("notes")

      .select("*")

      .order("created_at",{

        ascending:false,

      });





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

      notes,

    });



  }catch(error){


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









// 新增記事
// POST /api/notes

export async function POST(

  request:Request

){


  try{


    const body = await request.json();



    const {

      title,

      content,

      created_by,

    } = body;





    if(!title){


      return NextResponse.json(

        {
          error:"標題不能為空",
        },

        {
          status:400,
        }

      );


    }








    const {

      data:note,

      error,

    } = await supabase

      .from("notes")

      .insert([

        {

          title,

          content:content ?? "",

          created_by,

        }

      ])

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

      note,

    });





  }catch(error){



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