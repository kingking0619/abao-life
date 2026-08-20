import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";




// 取得單一記事
// GET /api/notes/[id]

export async function GET(

  request:Request,

  {
    params,
  }:{
    params:Promise<{id:string}>
  }

){


  try{


    const {id}=await params;



    const {

      data:note,

      error,

    }=await supabase

      .from("notes")

      .select("*")

      .eq("id",id)

      .single();






    if(error){

      return NextResponse.json(

        {
          error:error.message
        },

        {
          status:500
        }

      );

    }







    return NextResponse.json({

      note,

    });





  }catch(error){


    return NextResponse.json(

      {
        error:String(error)
      },

      {
        status:500
      }

    );


  }


}











// 修改記事
// PATCH /api/notes/[id]

export async function PATCH(

  request:Request,

  {
    params,
  }:{
    params:Promise<{id:string}>
  }

){



  try{


    const {id}=await params;


    const body=await request.json();



    const {

      title,

      content,

    }=body;







    const {

      error,

    }=await supabase

      .from("notes")

      .update({

        title,

        content,

        updated_at:new Date().toISOString(),

      })

      .eq("id",id);







    if(error){


      return NextResponse.json(

        {
          error:error.message
        },

        {
          status:500
        }

      );


    }







    return NextResponse.json({

      success:true,

      message:"記事修改成功",

    });





  }catch(error){



    return NextResponse.json(

      {
        error:String(error)
      },

      {
        status:500
      }

    );


  }


}











// 刪除記事
// DELETE /api/notes/[id]

export async function DELETE(

  request:Request,

  {
    params,
  }:{
    params:Promise<{id:string}>
  }

){


  try{


    const {id}=await params;





    const {

      error,

    }=await supabase

      .from("notes")

      .delete()

      .eq("id",id);







    if(error){


      return NextResponse.json(

        {
          error:error.message
        },

        {
          status:500
        }

      );


    }







    return NextResponse.json({

      success:true,

      message:"記事刪除成功",

    });






  }catch(error){


    return NextResponse.json(

      {
        error:String(error)
      },

      {
        status:500
      }

    );


  }


}