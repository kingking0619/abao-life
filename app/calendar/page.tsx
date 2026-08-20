import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";


function getIcon(name:string){

  return name === "國王老師"
    ? "👑"
    : "🧸";

}


function getStatusIcon(status:string){

  if(status === "已完成"){
    return "✅";
  }

  if(status === "等待核可"){
    return "⏳";
  }

  if(status === "已退回"){
    return "↩️";
  }

  return "";
}


function pad(num:number){

  return String(num).padStart(
    2,
    "0"
  );

}


function getTaipeiToday(){

  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:"Asia/Taipei",
        year:"numeric",
        month:"2-digit",
        day:"2-digit",
      }
    )
    .formatToParts(
      new Date()
    );


  const year =
    Number(
      parts.find(
        part=>part.type==="year"
      )?.value
    );


  const month =
    Number(
      parts.find(
        part=>part.type==="month"
      )?.value
    );


  const day =
    Number(
      parts.find(
        part=>part.type==="day"
      )?.value
    );


  return {
    year,
    month,
    day,
  };

}


function getTaskDay(
  date:string
){

  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:"Asia/Taipei",
        year:"numeric",
        month:"2-digit",
        day:"2-digit",
      }
    )
    .formatToParts(
      new Date(date)
    );


  return {
    year:Number(
      parts.find(
        part=>part.type==="year"
      )?.value
    ),

    month:Number(
      parts.find(
        part=>part.type==="month"
      )?.value
    ),

    day:Number(
      parts.find(
        part=>part.type==="day"
      )?.value
    ),
  };

}


function getTaskTime(
  date:string
){

  return new Intl.DateTimeFormat(
    "zh-TW",
    {
      timeZone:"Asia/Taipei",
      hour:"2-digit",
      minute:"2-digit",
      hour12:false,
    }
  ).format(
    new Date(date)
  );

}


export default async function CalendarPage({

  searchParams,

}:{

  searchParams:Promise<{
    month?:string;
  }>;

}){


  const params =
    await searchParams;


  const today =
    getTaipeiToday();



  let year =
    today.year;

  let month =
    today.month;



  if(
    params.month &&
    /^\d{4}-\d{2}$/.test(
      params.month
    )
  ){

    const [
      queryYear,
      queryMonth,
    ] =
      params.month
        .split("-")
        .map(Number);


    if(
      queryMonth >= 1 &&
      queryMonth <= 12
    ){

      year =
        queryYear;

      month =
        queryMonth;

    }

  }



  // =====================
  // 上 / 下個月
  // =====================

  const previous =
    new Date(
      year,
      month-2,
      1
    );


  const next =
    new Date(
      year,
      month,
      1
    );


  const previousMonth =
    `${previous.getFullYear()}-${pad(
      previous.getMonth()+1
    )}`;


  const nextMonth =
    `${next.getFullYear()}-${pad(
      next.getMonth()+1
    )}`;



  // =====================
  // 本月日期
  // =====================

  const daysInMonth =
    new Date(
      year,
      month,
      0
    ).getDate();


  const firstDay =
    new Date(
      year,
      month-1,
      1
    ).getDay();



  // =====================
  // 查詢範圍
  // 台灣 +08:00
  // =====================

  const start =
    `${year}-${pad(month)}-01T00:00:00+08:00`;


  let endYear =
    year;

  let endMonth =
    month+1;


  if(endMonth===13){

    endMonth=1;

    endYear++;

  }


  const end =
    `${endYear}-${pad(endMonth)}-01T00:00:00+08:00`;



  const {
    data:tasks,
    error,
  } = await supabase

    .from("tasks")

    .select("*")

    .gte(
      "due_at",
      start
    )

    .lt(
      "due_at",
      end
    )

    .order(
      "due_at",
      {
        ascending:true,
      }
    );



  if(error){

    console.error(
      "月曆任務取得失敗:",
      error
    );

  }



  const allTasks =
    tasks ?? [];



  function getTasksForDay(
    day:number
  ){

    return allTasks.filter(
      task=>{

        if(!task.due_at){
          return false;
        }


        const taskDate =
          getTaskDay(
            task.due_at
          );


        return (
          taskDate.year===year &&
          taskDate.month===month &&
          taskDate.day===day
        );

      }
    );

  }



  const calendarCells =
    Array.from(
      {
        length:
          firstDay +
          daysInMonth,
      }
    );



  return (

    <main className="min-h-screen bg-[#fffaf2] p-4 pb-32 text-gray-800">


      <div className="mx-auto max-w-2xl">


        {/* 標題 */}

        <div className="mb-5 flex items-center justify-between gap-3">


          <h1 className="text-3xl font-bold">
            📅 月曆
          </h1>


          <Link
            href="/tasks/new"
            className="rounded-2xl bg-black px-4 py-3 text-sm font-bold text-white"
          >
            ＋ 任務
          </Link>


        </div>



        {/* 月份切換 */}

        <section className="rounded-3xl bg-white p-4 shadow">


          <div className="flex items-center justify-between">


            <Link
              href={`/calendar?month=${previousMonth}`}
              className="rounded-2xl bg-gray-100 px-4 py-3 font-bold"
            >
              ←
            </Link>



            <div className="text-center">


              <h2 className="text-xl font-bold">

                {year} 年 {month} 月

              </h2>


              <Link
                href="/calendar"
                className="mt-1 block text-xs text-gray-400"
              >
                回到今天
              </Link>


            </div>



            <Link
              href={`/calendar?month=${nextMonth}`}
              className="rounded-2xl bg-gray-100 px-4 py-3 font-bold"
            >
              →
            </Link>


          </div>


        </section>



        {/* 月曆 */}

        <section className="mt-5 overflow-hidden rounded-3xl bg-white p-3 shadow">


          {/* 星期 */}

          <div className="grid grid-cols-7">


            {[
              "日",
              "一",
              "二",
              "三",
              "四",
              "五",
              "六",
            ].map(
              week=>(

                <div
                  key={week}
                  className="py-2 text-center text-xs font-bold text-gray-400"
                >
                  {week}
                </div>

              )
            )}


          </div>



          {/* 日期 */}

          <div className="grid grid-cols-7">


            {calendarCells.map(
              (_,index)=>{


                if(
                  index <
                  firstDay
                ){

                  return (

                    <div
                      key={`empty-${index}`}
                      className="min-h-24 border-t border-gray-100"
                    />

                  );

                }



                const day =
                  index -
                  firstDay +
                  1;


                const dayTasks =
                  getTasksForDay(
                    day
                  );


                const isToday =
                  year===today.year &&
                  month===today.month &&
                  day===today.day;



                return (

                  <div
                    key={day}
                    className="
                      min-h-24
                      border-t
                      border-gray-100
                      p-1
                    "
                  >


                    <div
                      className={
                        isToday
                          ?
                          "flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-bold text-white"
                          :
                          "flex h-7 w-7 items-center justify-center text-sm font-bold"
                      }
                    >
                      {day}
                    </div>



                    <div className="mt-1 space-y-1">


                      {dayTasks
                        .slice(0,3)
                        .map(
                          task=>(

                            <Link
                              key={task.id}
                              href={`/tasks/${task.id}`}
                              className="
                                block
                                overflow-hidden
                                rounded-lg
                                bg-[#fff5dc]
                                px-1.5
                                py-1
                                text-[10px]
                                leading-tight
                              "
                              title={task.title}
                            >

                              <div className="truncate font-bold">

                                {getStatusIcon(
                                  task.status
                                )}

                                {getIcon(
                                  task.assign_to
                                )}

                                {" "}

                                {task.title}

                              </div>


                              <div className="mt-0.5 text-[9px] text-gray-400">

                                {getTaskTime(
                                  task.due_at
                                )}

                              </div>


                            </Link>

                          )
                        )}



                      {dayTasks.length > 3 && (

                        <div className="px-1 text-[9px] text-gray-400">

                          +{dayTasks.length-3} 個

                        </div>

                      )}


                    </div>


                  </div>

                );

              }
            )}


          </div>


        </section>



        {/* 本月任務摘要 */}

        <section className="mt-5 rounded-3xl bg-white p-5 shadow">


          <h2 className="text-xl font-bold">
            📋 本月任務
          </h2>


          <p className="mt-2 text-gray-500">

            共 {allTasks.length} 個有設定期限的任務

          </p>


        </section>


      </div>


      <BottomNav />


    </main>

  );

}