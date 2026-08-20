"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";



export default function EditTaskPage() {


  const params = useParams();

  const router = useRouter();


  const id = params.id as string;



  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [person, setPerson] = useState("阿寶");

  const [reward, setReward] = useState("20");

  const [dueAt, setDueAt] = useState("");

  const [penalty, setPenalty] = useState("0");

  const [loading, setLoading] = useState(true);





  useEffect(() => {


    async function loadTask() {


      const response = await fetch(
        `/api/tasks/${id}`
      );


      const data = await response.json();



      if (data.task) {


        setTitle(data.task.title ?? "");

        setDescription(data.task.description ?? "");

        setPerson(data.task.assign_to ?? "阿寶");

        setReward(
          String(data.task.reward ?? 20)
        );

        setPenalty(
          String(data.task.penalty ?? 0)
        );



        if (data.task.due_at) {

          const date = new Date(
            data.task.due_at
          );


          const formatted =
            `${date.getFullYear()}-${String(
              date.getMonth()+1
            ).padStart(2,"0")}-${String(
              date.getDate()
            ).padStart(2,"0")}T${String(
              date.getHours()
            ).padStart(2,"0")}:${String(
              date.getMinutes()
            ).padStart(2,"0")}`;


          setDueAt(formatted);

        }


      }


      setLoading(false);


    }


    loadTask();


  }, [id]);







  async function saveTask() {


    const response = await fetch(

      `/api/tasks/${id}`,

      {

        method:"PATCH",

        body:JSON.stringify({

          title,

          description,

          assign_to:person,

          reward:Number(reward),

          due_at:dueAt
            ? new Date(dueAt).toISOString()
            : null,

          penalty:Number(penalty),

        }),

      }

    );



    if(response.ok){

      alert("任務修改成功");

      router.push(
        `/tasks/${id}`
      );


    }else{


      alert("修改失敗");


    }


  }






  if(loading){


    return (

      <main className="min-h-screen bg-[#fffaf2] p-5">

        載入中...

      </main>

    );

  }







  return (


    <main className="min-h-screen bg-[#fffaf2] p-5 pb-28 text-gray-800">


      <div className="mx-auto max-w-md">


        <h1 className="mb-6 text-3xl font-bold">

          ✏️ 編輯任務

        </h1>






        <section className="rounded-3xl bg-white p-5 shadow">





          <label className="font-bold">

            任務名稱

          </label>


          <input

            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"

            value={title}

            onChange={
              e=>setTitle(e.target.value)
            }

          />







          <label className="mt-5 block font-bold">

            任務描述

          </label>


          <textarea

            className="mt-2 h-24 w-full rounded-2xl bg-gray-100 p-3"

            value={description}

            onChange={
              e=>setDescription(e.target.value)
            }

          />








          <label className="mt-5 block font-bold">

            指派給

          </label>


          <select

            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"

            value={person}

            onChange={
              e=>setPerson(e.target.value)
            }

          >

            <option value="阿寶">

              🧸 阿寶

            </option>


            <option value="國王老師">

              👑 國王老師

            </option>


          </select>








          <label className="mt-5 block font-bold">

            阿寶幣獎勵

          </label>


          <input

            type="number"

            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"

            value={reward}

            onChange={
              e=>setReward(e.target.value)
            }

          />









          <label className="mt-5 block font-bold">

            完成期限

          </label>


          <input

            type="datetime-local"

            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"

            value={dueAt}

            onChange={
              e=>setDueAt(e.target.value)
            }

          />









          <label className="mt-5 block font-bold">

            逾期扣除阿寶幣

          </label>


          <input

            type="number"

            className="mt-2 w-full rounded-2xl bg-gray-100 p-3"

            value={penalty}

            onChange={
              e=>setPenalty(e.target.value)
            }

          />







          <button

            onClick={saveTask}

            className="mt-6 w-full rounded-2xl bg-black p-4 font-bold text-white"

          >

            儲存修改

          </button>





        </section>






        <Link

          href={`/tasks/${id}`}

          className="mt-5 block text-center text-gray-500"

        >

          ← 返回任務

        </Link>




      </div>


    </main>


  );

}