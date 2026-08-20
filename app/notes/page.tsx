import Link from "next/link";

import BottomNav from "@/components/BottomNav";
import SortableNoteList from "@/components/SortableNoteList";

import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";

export default async function NotesPage() {


  const {
    data:notes,
    error,
  } = await supabase
    .from("notes")
    .select("*")
    .order("sort_order", {
      ascending:true,
    })
    .order("created_at", {
      ascending:false,
    });



  if(error){

    console.error(
      "載入記事失敗:",
      error
    );

  }



  const allNotes =
    notes ?? [];



  return (

    <main
      className="
        min-h-screen
        bg-[#fffaf2]
        p-5
        pb-32
        text-gray-800
      "
    >


      <div className="mx-auto max-w-md">


        {/* 標題 */}

        <div className="mb-6 flex items-center justify-between gap-3">


          <h1 className="text-3xl font-bold">
            📝 記事
          </h1>


          <Link
            href="/notes/new"
            className="
              shrink-0
              rounded-2xl
              bg-black
              px-4
              py-3
              text-sm
              font-bold
              text-white
            "
          >
            ＋ 新增記事
          </Link>


        </div>



        {/* 記事列表 */}

        {allNotes.length === 0 ? (

          <section
            className="
              rounded-3xl
              bg-white
              p-6
              text-center
              shadow
            "
          >

            <p className="text-gray-400">
              目前沒有記事
            </p>


            <Link
              href="/notes/new"
              className="
                mt-4
                inline-block
                rounded-2xl
                bg-black
                px-4
                py-3
                font-bold
                text-white
              "
            >
              ＋ 建立第一篇記事
            </Link>


          </section>

        ) : (

          <SortableNoteList
            initialNotes={allNotes}
          />

        )}


      </div>


      <BottomNav />


    </main>

  );

}