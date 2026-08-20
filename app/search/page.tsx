"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import BottomNav from "@/components/BottomNav";


type SearchResults = {

  tasks: any[];

  notes: any[];

};



function getUserIcon(
  name: string
) {

  return name === "國王老師"
    ? "👑"
    : "🧸";

}



export default function SearchPage() {

  const [
    query,
    setQuery,
  ] = useState("");


  const [
    results,
    setResults,
  ] = useState<SearchResults>({
    tasks: [],
    notes: [],
  });


  const [
    loading,
    setLoading,
  ] = useState(false);



  useEffect(() => {

    const text =
      query.trim();


    if (!text) {

      setResults({
        tasks: [],
        notes: [],
      });

      setLoading(false);

      return;

    }



    const timer =
      window.setTimeout(
        async () => {

          setLoading(true);


          try {

            const response =
              await fetch(
                `/api/search?q=${encodeURIComponent(text)}`
              );


            const data =
              await response.json();


            if (!response.ok) {

              console.error(
                data
              );

              return;

            }


            setResults({
              tasks:
                data.tasks ?? [],

              notes:
                data.notes ?? [],
            });


          } catch (error) {

            console.error(
              "搜尋失敗:",
              error
            );

          } finally {

            setLoading(false);

          }

        },
        300
      );


    return () => {

      window.clearTimeout(
        timer
      );

    };

  }, [query]);



  const totalResults =
    results.tasks.length +
    results.notes.length;



  return (

    <main className="min-h-screen bg-[#fffaf2] p-5 pb-32 text-gray-800">


      <div className="mx-auto max-w-md">


        <h1 className="text-3xl font-bold">

          🔎 全域搜尋

        </h1>



        <div className="mt-5 rounded-3xl bg-white p-4 shadow">


          <input
            autoFocus
            value={query}
            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }
            placeholder="搜尋任務、聊天室、記事..."
            className="
              w-full
              rounded-2xl
              bg-gray-100
              p-4
              text-base
              outline-none
            "
          />


          {query.trim() && (

            <p className="mt-3 text-sm text-gray-400">

              {loading
                ? "搜尋中..."
                : `找到 ${totalResults} 筆結果`}

            </p>

          )}


        </div>



        {/* 空白搜尋 */}

        {!query.trim() && (

          <section className="mt-5 rounded-3xl bg-white p-6 text-center shadow">

            <div className="text-4xl">
              🔍
            </div>


            <p className="mt-3 font-bold">
              搜尋阿寶的理想生活
            </p>


            <p className="mt-2 text-sm text-gray-400">
              可以搜尋任務、聊天室與記事
            </p>

          </section>

        )}



        {/* 沒結果 */}

        {
          query.trim() &&
          !loading &&
          totalResults === 0 &&
          (

            <section className="mt-5 rounded-3xl bg-white p-6 text-center shadow">

              <p className="text-gray-400">

                找不到「{query}」

              </p>

            </section>

          )
        }



        {/* 任務搜尋結果 */}

        {results.tasks.length > 0 && (

          <section className="mt-6">


            <h2 className="mb-3 text-xl font-bold">

              📋 任務

              <span className="ml-2 text-sm font-normal text-gray-400">

                {results.tasks.length}

              </span>

            </h2>



            <div className="space-y-3">


              {results.tasks.map(
                task => (

                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="block rounded-3xl bg-white p-5 shadow"
                  >


                    <div className="flex items-start justify-between gap-3">


                      <div className="min-w-0">


                        <h3 className="break-words text-lg font-bold">

                          {task.title}

                        </h3>


                        <p className="mt-2 text-sm text-gray-500">

                          {getUserIcon(
                            task.assign_to
                          )}

                          {" "}

                          {task.assign_to}

                        </p>


                      </div>



                      <span className="shrink-0 font-bold">

                        🪙 {task.reward}

                      </span>


                    </div>



                    {task.description && (

                      <p className="mt-3 line-clamp-2 whitespace-pre-wrap text-sm text-gray-500">

                        {task.description}

                      </p>

                    )}



                    <div className="mt-3 flex flex-wrap gap-2">


                      {task.matched_in?.map(
                        (
                          type:string
                        ) => (

                          <span
                            key={type}
                            className="rounded-full bg-[#fff5dc] px-3 py-1 text-xs font-bold"
                          >

                            {type}

                          </span>

                        )
                      )}


                    </div>



                    {/* 聊天室命中 */}

                    {
                      task.matched_comments
                        ?.length > 0 &&
                      (

                        <div className="mt-3 space-y-2">


                          {task.matched_comments
                            .slice(0,3)
                            .map(
                              (
                                comment:any
                              ) => (

                                <div
                                  key={
                                    comment.id
                                  }
                                  className="rounded-2xl bg-gray-50 p-3"
                                >

                                  <p className="text-xs text-gray-400">

                                    💬

                                    {" "}

                                    {getUserIcon(
                                      comment.user_name
                                    )}

                                    {" "}

                                    {
                                      comment.user_name
                                    }

                                  </p>


                                  <p className="mt-1 text-sm">

                                    {
                                      comment.content
                                    }

                                  </p>

                                </div>

                              )
                            )}


                        </div>

                      )
                    }


                  </Link>

                )
              )}


            </div>


          </section>

        )}



        {/* 記事搜尋結果 */}

        {results.notes.length > 0 && (

          <section className="mt-6">


            <h2 className="mb-3 text-xl font-bold">

              📝 記事

              <span className="ml-2 text-sm font-normal text-gray-400">

                {results.notes.length}

              </span>

            </h2>



            <div className="space-y-3">


              {results.notes.map(
                note => (

                  <Link
                    key={note.id}
                    href={`/notes/${note.id}`}
                    className="block rounded-3xl bg-white p-5 shadow"
                  >


                    <div className="flex items-start justify-between gap-3">


                      <h3 className="break-words text-lg font-bold">

                        {note.is_pinned
                          ? "📌 "
                          : ""}

                        {note.title}

                      </h3>


                      <span className="shrink-0 text-sm text-gray-400">

                        {getUserIcon(
                          note.created_by
                        )}

                      </span>


                    </div>



                    {note.content && (

                      <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm text-gray-500">

                        {note.content}

                      </p>

                    )}



                    <div className="mt-3 flex flex-wrap gap-2">


                      {note.matched_in?.map(
                        (
                          type:string
                        ) => (

                          <span
                            key={type}
                            className="rounded-full bg-[#fff5dc] px-3 py-1 text-xs font-bold"
                          >

                            {type}

                          </span>

                        )
                      )}


                    </div>


                  </Link>

                )
              )}


            </div>


          </section>

        )}


      </div>


      <BottomNav />


    </main>

  );

}