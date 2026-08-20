"use client";

import { useState } from "react";
import { useUser } from "@/components/UserContext";


export default function ApproveButton({

  id,

  createdBy,

}: {

  id:number;

  createdBy:string | null;

}) {


  const {
    currentUser,
    loading,
  } = useUser();


  const [comment,setComment] = useState("");

  const [submitting,setSubmitting] = useState(false);




  async function sendAction(
    action:"approve"|"reject"
  ){


    if(!currentUser){

      alert("請先選擇身分");

      return;

    }



    if(currentUser !== createdBy){

      alert("你不是這個任務的建立者，無法審核");

      return;

    }



    if(submitting){

      return;

    }



    setSubmitting(true);



    try{


      const response = await fetch(
        `/api/tasks/${id}/approve`,
        {

          method:"POST",

          headers:{

            "Content-Type":"application/json",

          },

          body:JSON.stringify({

            action,

            comment,

            reviewer:currentUser,

          }),

        }
      );



      const data = await response.json();



      if(!response.ok){

        alert(
          data.error ??
          "操作失敗"
        );

        return;

      }



      window.location.reload();


    }catch(error){


      console.error(error);

      alert("操作失敗");


    }finally{

      setSubmitting(false);

    }


  }




  if(loading){

    return null;

  }



  // 舊任務如果沒有 created_by
  if(!createdBy){

    return (

      <div className="mt-5 rounded-2xl bg-yellow-50 p-3 text-sm text-yellow-700">

        ⚠️ 這是舊任務，沒有建立者資料，暫時無法判斷審核身分

      </div>

    );

  }



  // 不是建立者，不顯示審核按鈕
  if(currentUser !== createdBy){

    return (

      <div className="mt-5 rounded-2xl bg-gray-100 p-3 text-center text-sm text-gray-500">

        等待 {createdBy === "國王老師"
          ? "👑 國王老師"
          : "🧸 阿寶"} 確認

      </div>

    );

  }



  return (

    <div className="mt-5 space-y-3">


      <div className="rounded-2xl bg-[#fff5dc] p-3 text-center font-bold">

        {currentUser === "國王老師"
          ? "👑 國王老師確認"
          : "🧸 阿寶確認"}

      </div>



      <textarea

        value={comment}

        onChange={(e)=>
          setComment(e.target.value)
        }

        placeholder="留下評語（可選）"

        className="
          w-full
          rounded-2xl
          border
          p-3
        "

      />



      <div className="flex gap-3">


        <button

          onClick={()=>
            sendAction("approve")
          }

          disabled={submitting}

          className="
            flex-1
            rounded-2xl
            bg-green-500
            p-3
            font-bold
            text-white
            disabled:opacity-50
          "

        >

          {submitting
            ? "處理中..."
            : "✅ 核可"}

        </button>



        <button

          onClick={()=>
            sendAction("reject")
          }

          disabled={submitting}

          className="
            flex-1
            rounded-2xl
            bg-red-400
            p-3
            font-bold
            text-white
            disabled:opacity-50
          "

        >

          {submitting
            ? "處理中..."
            : "↩️ 退回"}

        </button>


      </div>


    </div>

  );

}