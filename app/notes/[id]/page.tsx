import DeleteNoteButton from "@/components/DeleteNoteButton";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";


function getUserIcon(name:string){

  if(name==="國王老師"){
    return "👑";
  }

  return "🧸";

}




function formatDate(date:string){

  const d = new Date(date);

  return (
    `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ` +
    `${String(d.getHours()).padStart(2,"0")}:` +
    `${String(d.getMinutes()).padStart(2,"0")}`
  );

}








export default async function NoteDetailPage({

  params,

}:{

  params:Promise<{id:string}>;

}){


  const {id}=await params;





  const {

    data:note,

    error,

  }=await supabase

    .from("notes")

    .select("*")

    .eq("id",id)

    .single();








  if(error || !note){


    return (

      <main className="min-h-screen bg-[#fffaf2] p-5">

        找不到記事

      </main>

    );

  }








  return (

    <main className="min-h-screen bg-[#fffaf2] p-5 pb-28 text-gray-800">


      <div className="mx-auto max-w-md">



        <Link

          href="/notes"

          className="mb-5 block text-gray-500"

        >

          ← 返回記事

        </Link>








        <section className="rounded-3xl bg-white p-5 shadow">





          <div className="flex items-center justify-between">


            <h1 className="text-2xl font-bold">

              {note.title}

            </h1>





            <Link

              href={`/notes/${note.id}/edit`}

              className="
                rounded-xl
                bg-gray-100
                px-3
                py-2
                text-xl
              "

            >

              ✏️

            </Link>


          </div>









          <p className="mt-4 text-gray-500">


            {getUserIcon(note.created_by)}

            {" "}

            {note.created_by}


          </p>









          <div
            className="
              mt-5
              whitespace-pre-wrap
              rounded-2xl
              bg-gray-100
              p-4
            "
          >


            {note.content || "沒有內容"}


          </div>









          <p className="mt-5 text-sm text-gray-400">


            建立：

            {formatDate(note.created_at)}


          </p>







          <DeleteNoteButton

            id={note.id}

          />





        </section>





      </div>





      <BottomNav />


    </main>

  );


}