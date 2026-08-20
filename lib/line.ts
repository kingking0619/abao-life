export function getLineUserId(
  user: string
) {

  if (user === "國王老師") {

    return process.env
      .LINE_USER_ID_KING;

  }


  if (user === "阿寶") {

    return process.env
      .LINE_USER_ID_ABAO;

  }


  return undefined;

}



export async function sendLineMessage(
  user: string,
  text: string
) {

  const token =
    process.env
      .LINE_CHANNEL_ACCESS_TOKEN;


  const userId =
    getLineUserId(user);



  if (!token) {

    throw new Error(
      "LINE_CHANNEL_ACCESS_TOKEN 未設定"
    );

  }


  if (!userId) {

    throw new Error(
      `找不到 ${user} 的 LINE User ID`
    );

  }



  const response =
    await fetch(
      "https://api.line.me/v2/bot/message/push",
      {
        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

        },

        body:
          JSON.stringify({

            to: userId,

            messages: [

              {
                type: "text",
                text,
              },

            ],

          }),

      }
    );



  if (!response.ok) {

    const errorText =
      await response.text();


    console.error(
      "LINE Push 失敗:",
      errorText
    );


    throw new Error(
      `LINE Push 失敗：${errorText}`
    );

  }


  return true;

}