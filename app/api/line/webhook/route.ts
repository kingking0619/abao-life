import { NextResponse } from "next/server";


export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();


    console.log(
      "LINE WEBHOOK:",
      JSON.stringify(
        body,
        null,
        2
      )
    );


    for (
      const event
      of body.events ?? []
    ) {

      const userId =
        event?.source?.userId;


      if (userId) {

        console.log(
          "LINE USER ID:",
          userId
        );

      }

    }


    return NextResponse.json({
      success: true,
    });


  } catch (error) {

    console.error(
      "LINE webhook error:",
      error
    );


    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );

  }

}