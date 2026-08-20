import {
  NextResponse,
} from "next/server";

import {
  sendLineMessage,
} from "@/lib/line";


export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();


    const {
      user,
    } = body;



    if (
      user !== "國王老師" &&
      user !== "阿寶"
    ) {

      return NextResponse.json(
        {
          error:
            "請指定國王老師或阿寶",
        },
        {
          status: 400,
        }
      );

    }



    await sendLineMessage(

      user,

      `🔔 LINE 通知測試

${user} 的通知已成功連線！

來自：阿寶的理想生活`

    );



    return NextResponse.json({

      success: true,

      message:
        `測試訊息已傳送給 ${user}`,

    });


  } catch (error) {

    console.error(error);


    return NextResponse.json(
      {
        error:
          String(error),
      },
      {
        status: 500,
      }
    );

  }

}