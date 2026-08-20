"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";


export default function EditNotePage(){


  const params = useParams();

  const router = useRouter();


  const id = params.id as string;



  const [title,setTitle] = useState("");

  const [content,setContent] = useState("");

  const [loading,setLoading] = useState(true);





  useEffect(()=>{


    async function load(){


      const res = await fetch(
        `/api/notes/${id}`
      );


      const data = await res.json();



      if(data.note){

        setTitle(data.note.title);

        setContent(data.note.content ?? "");

      }



      setLoading(false);


    }



    load();



  },[id]);







  async function save(){



    await fetch(

      `/api/notes/${id}`,

      {

        method:"PATCH",

        headers:{

          "Content-Type":"application/json",

        },

        body:JSON.stringify({

          title,

          content,

        }),

      }

    );





    router.push(`/notes/${id}`);

    router.refresh();


  }







  if(loading){


    return (

      <main className="p-5">

        載入中...

      </main>

    );

  }







  return (

    <main className="min-h-screen bg-[#fffaf2] p-5 text-gray-800">


      <div className="mx-auto max-w-md">


        <Link

          href={`/notes/${id}`}

          className="mb-5 block text-gray-500"

        >

          ← 返回記事

        </Link>






        <section className="rounded-3xl bg-white p-5 shadow">


          <h1 className="text-2xl font-bold">

            ✏️ 編輯記事

          </h1>






          <input

            value={title}

            onChange={(e)=>setTitle(e.target.value)}

            className="
              mt-5
              w-full
              rounded-2xl
              border
              p-3
            "

            placeholder="標題"

          />






          <textarea

            value={content}

            onChange={(e)=>setContent(e.target.value)}

            rows={8}

            className="
              mt-4
              w-full
              rounded-2xl
              border
              p-3
            "

            placeholder="內容"

          />






          <button

            onClick={save}

            className="
              mt-5
              w-full
              rounded-2xl
              bg-black
              p-3
              font-bold
              text-white
            "

          >

            💾 儲存修改

          </button>



        </section>



      </div>


    </main>

  );


}