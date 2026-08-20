import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function GET(
  request: Request
) {

  try {

    const { searchParams } =
      new URL(request.url);


    const query =
      searchParams
        .get("q")
        ?.trim()
        .slice(0, 100)
        ?? "";


    if (!query) {

      return NextResponse.json({
        tasks: [],
        notes: [],
      });

    }


    const pattern =
      `%${query}%`;



    // =====================
    // 同時搜尋
    // =====================

    const [
      taskTitleResult,
      taskDescriptionResult,
      commentResult,
      noteTitleResult,
      noteContentResult,
    ] = await Promise.all([


      // 任務標題
      supabase
        .from("tasks")
        .select("*")
        .ilike(
          "title",
          pattern
        )
        .limit(100),


      // 任務描述
      supabase
        .from("tasks")
        .select("*")
        .ilike(
          "description",
          pattern
        )
        .limit(100),


      // 任務聊天室
      supabase
        .from("task_comments")
        .select(`
          id,
          task_id,
          content,
          user_name,
          created_at
        `)
        .ilike(
          "content",
          pattern
        )
        .limit(100),


      // 記事標題
      supabase
        .from("notes")
        .select("*")
        .ilike(
          "title",
          pattern
        )
        .limit(100),


      // 記事內容
      supabase
        .from("notes")
        .select("*")
        .ilike(
          "content",
          pattern
        )
        .limit(100),

    ]);



    // =====================
    // 檢查錯誤
    // =====================

    const errors = [
      taskTitleResult.error,
      taskDescriptionResult.error,
      commentResult.error,
      noteTitleResult.error,
      noteContentResult.error,
    ].filter(Boolean);


    if (errors.length > 0) {

      return NextResponse.json(
        {
          error:
            errors[0]?.message ??
            "搜尋失敗",
        },
        {
          status: 500,
        }
      );

    }



    // =====================
    // 合併任務搜尋結果
    // =====================

    const taskMap =
      new Map<any, any>();



    for (
      const task
      of taskTitleResult.data ?? []
    ) {

      taskMap.set(
        task.id,
        {
          ...task,

          matched_in: [
            "任務標題"
          ],

          matched_comments: [],
        }
      );

    }



    for (
      const task
      of taskDescriptionResult.data ?? []
    ) {

      const existing =
        taskMap.get(task.id);


      if (existing) {

        if (
          !existing.matched_in.includes(
            "任務內容"
          )
        ) {

          existing.matched_in.push(
            "任務內容"
          );

        }

      } else {

        taskMap.set(
          task.id,
          {
            ...task,

            matched_in: [
              "任務內容"
            ],

            matched_comments: [],
          }
        );

      }

    }



    // =====================
    // 聊天室命中的 task_id
    // =====================

    const comments =
      commentResult.data ?? [];


    const commentTaskIds =
      Array.from(
        new Set(
          comments.map(
            comment =>
              comment.task_id
          )
        )
      );



    // 抓聊天室所屬任務
    if (
      commentTaskIds.length > 0
    ) {

      const {
        data: commentTasks,
        error: commentTasksError,
      } = await supabase

        .from("tasks")

        .select("*")

        .in(
          "id",
          commentTaskIds
        );


      if (commentTasksError) {

        return NextResponse.json(
          {
            error:
              commentTasksError.message,
          },
          {
            status: 500,
          }
        );

      }



      for (
        const task
        of commentTasks ?? []
      ) {

        const taskComments =
          comments.filter(
            comment =>
              comment.task_id ===
              task.id
          );


        const existing =
          taskMap.get(task.id);


        if (existing) {

          if (
            !existing.matched_in.includes(
              "聊天室"
            )
          ) {

            existing.matched_in.push(
              "聊天室"
            );

          }


          existing.matched_comments =
            taskComments;

        } else {

          taskMap.set(
            task.id,
            {
              ...task,

              matched_in: [
                "聊天室"
              ],

              matched_comments:
                taskComments,
            }
          );

        }

      }

    }



    // =====================
    // 合併記事
    // =====================

    const noteMap =
      new Map<any, any>();



    for (
      const note
      of noteTitleResult.data ?? []
    ) {

      noteMap.set(
        note.id,
        {
          ...note,

          matched_in: [
            "記事標題"
          ],
        }
      );

    }



    for (
      const note
      of noteContentResult.data ?? []
    ) {

      const existing =
        noteMap.get(note.id);


      if (existing) {

        if (
          !existing.matched_in.includes(
            "記事內容"
          )
        ) {

          existing.matched_in.push(
            "記事內容"
          );

        }

      } else {

        noteMap.set(
          note.id,
          {
            ...note,

            matched_in: [
              "記事內容"
            ],
          }
        );

      }

    }



    return NextResponse.json({

      tasks:
        Array.from(
          taskMap.values()
        ),

      notes:
        Array.from(
          noteMap.values()
        ),

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