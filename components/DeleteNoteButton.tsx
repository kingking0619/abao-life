"use client";

import { useRouter } from "next/navigation";


export default function DeleteNoteButton({

  id,

}:{

  id:string;

}){


  const router = useRouter();





  async function remove(){


    const confirmDelete = confirm(
      "確定要刪除這篇記事嗎？"
    );


    if(!confirmDelete) return;






    const res = await fetch(

      `/api/notes/${id}`,

      {

        method:"DELETE",

      }

    );





    if(res.ok){


      router.push("/notes");

      router.refresh();


    }


  }







  return (

    <button

      onClick={remove}

      className="
        mt-5
        w-full
        rounded-2xl
        bg-red-400
        p-3
        font-bold
        text-white
      "

    >

      🗑️ 刪除記事

    </button>

  );


}