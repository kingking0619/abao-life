"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContext";


export default function ChainStepSetup({
  id,
  createdBy,
  chainStep,
}: {
  id: number;
  createdBy: string;
  chainStep: number;
}) {

  const router = useRouter();

  const {
    currentUser,
    loading: userLoading,
  } = useUser();


  const [dueAt,setDueAt] =
    useState("");

  const [penalty,setPenalty] =
    useState("0");

  const [loading,setLoading] =
    useState(false);



  async function save(){

    if(!dueAt){

      alert("請設定截止時間");

      return;

    }


    if(currentUser !== createdBy){

      alert("只有任務建立者可以設定期限");

      return;

    }


    setLoading(true);


    try{

      const response =
        await fetch(
          `/api/tasks/${id}/chain-start`,
          {
            method:"PATCH",

            headers:{
              "Content-Type":"application/json",
            },

            body:JSON.stringify({
              due_at:
                new Date(
                  dueAt
                ).toISOString(),

              penalty:
                Number(
                  penalty || 0
                ),

              user:
                currentUser,
            }),
          }
        );


      const data =
        await response.json();


      if(!response.ok){

        alert(
          data.error ??
          "設定期限失敗"
        );

        return;

      }


      router.refresh();


    }catch(error){

      console.error(error);

      alert("設定期限失敗");

    }finally{

      setLoading(false);

    }

  }



  if(userLoading){
    return null;
  }



  // 執行者看到等待建立者設定
  if(currentUser !== createdBy){

    return(

      <div className="mt-5 rounded-2xl bg-[#fff5dc] p-4">

        <p className="font-bold">
          🔓 第 {chainStep} 關已解鎖
        </p>

        <p className="mt-2 text-sm text-gray-500">

          等待

          {" "}

          {createdBy === "國王老師"
            ? "👑 國王老師"
            : "🧸 阿寶"}

          {" "}

          設定本關截止時間

        </p>

      </div>

    );

  }



  return(

    <div className="mt-5 rounded-2xl bg-[#fff5dc] p-4">


      <h3 className="font-bold">
        🔓 第 {chainStep} 關已解鎖
      </h3>


      <p className="mt-1 text-sm text-gray-500">
        設定期限後即可開始本關
      </p>



      <label className="mt-4 block text-sm font-bold">
        ⏰ 截止時間
      </label>


      <input
        type="datetime-local"
        value={dueAt}
        onChange={(e)=>
          setDueAt(
            e.target.value
          )
        }
        className="mt-2 w-full rounded-2xl bg-white p-3"
      />



      <label className="mt-4 block text-sm font-bold">
        ⚠️ 逾期扣除
      </label>


      <input
        type="number"
        min="0"
        value={penalty}
        onChange={(e)=>
          setPenalty(
            e.target.value
          )
        }
        className="mt-2 w-full rounded-2xl bg-white p-3"
      />



      <button
        type="button"
        onClick={save}
        disabled={
          loading ||
          !dueAt
        }
        className="mt-4 w-full rounded-2xl bg-black p-3 font-bold text-white disabled:opacity-40"
      >

        {loading
          ? "設定中..."
          : "▶️ 設定期限並開始本關"}

      </button>


    </div>

  );

}