"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Link from "next/link";


export default function EditShopItemPage(){

  const params = useParams();

  const router = useRouter();


  const id =
    params.id as string;


  const [name,setName] =
    useState("");

  const [price,setPrice] =
    useState("");

  const [
    description,
    setDescription
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    saving,
    setSaving
  ] = useState(false);

  const [
    deleting,
    setDeleting
  ] = useState(false);



  useEffect(()=>{

    async function load(){

      try{

        const response =
          await fetch(
            `/api/shop-items/${id}`
          );


        const data =
          await response.json();


        if(!response.ok){

          alert(
            data.error ??
            "找不到獎勵"
          );

          router.push("/shop");

          return;

        }


        setName(
          data.name ?? ""
        );

        setPrice(
          String(
            data.price ?? ""
          )
        );

        setDescription(
          data.description ?? ""
        );


      }catch(error){

        console.error(error);

        alert("載入獎勵失敗");

      }finally{

        setLoading(false);

      }

    }


    if(id){
      load();
    }

  },[id,router]);



  async function save(){

    if(!name.trim()){

      alert("請輸入獎勵名稱");

      return;

    }


    if(
      price === ""
      ||
      Number(price) < 0
    ){

      alert(
        "請輸入正確的阿寶幣價格"
      );

      return;

    }


    if(saving){
      return;
    }


    setSaving(true);


    try{

      const response =
        await fetch(
          `/api/shop-items/${id}`,
          {
            method:"PATCH",

            headers:{
              "Content-Type":
                "application/json",
            },

            body:JSON.stringify({
              name,
              price:Number(price),
              description,
            }),
          }
        );


      const data =
        await response.json();


      if(!response.ok){

        alert(
          data.error ??
          "儲存失敗"
        );

        return;

      }


      router.push("/shop");

      router.refresh();


    }catch(error){

      console.error(error);

      alert("儲存失敗");

    }finally{

      setSaving(false);

    }

  }



  async function remove(){

    const confirmed =
      window.confirm(
        `確定要刪除「${name}」嗎？`
      );


    if(!confirmed){
      return;
    }


    setDeleting(true);


    try{

      const response =
        await fetch(
          `/api/shop-items/${id}`,
          {
            method:"DELETE",
          }
        );


      const data =
        await response.json();


      if(!response.ok){

        alert(
          data.error ??
          "刪除失敗"
        );

        return;

      }


      router.push("/shop");

      router.refresh();


    }catch(error){

      console.error(error);

      alert("刪除失敗");

    }finally{

      setDeleting(false);

    }

  }



  if(loading){

    return(

      <main className="min-h-screen bg-[#fffaf2] p-5">

        <div className="mx-auto max-w-md text-gray-400">
          載入中...
        </div>

      </main>

    );

  }



  return(

    <main className="min-h-screen bg-[#fffaf2] p-5 text-gray-800">


      <div className="mx-auto max-w-md">


        <Link
          href="/shop"
          className="mb-5 block text-gray-500"
        >
          ← 返回商城
        </Link>



        <section className="rounded-3xl bg-white p-5 shadow">


          <h1 className="text-2xl font-bold">
            ✏️ 編輯獎勵
          </h1>



          <div className="mt-5">

            <label className="font-bold">
              獎勵名稱
            </label>

            <input
              value={name}
              onChange={(e)=>
                setName(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
            />

          </div>



          <div className="mt-5">

            <label className="font-bold">
              🪙 所需阿寶幣
            </label>

            <input
              type="number"
              min="0"
              value={price}
              onChange={(e)=>
                setPrice(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
            />

          </div>



          <div className="mt-5">

            <label className="font-bold">
              📝 獎勵說明
            </label>

            <textarea
              value={description}
              onChange={(e)=>
                setDescription(
                  e.target.value
                )
              }
              rows={4}
              className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
            />

          </div>



          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="mt-6 w-full rounded-2xl bg-black p-4 font-bold text-white disabled:opacity-40"
          >

            {saving
              ? "儲存中..."
              : "儲存修改"}

          </button>



          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            className="mt-3 w-full rounded-2xl bg-red-50 p-4 font-bold text-red-500 disabled:opacity-40"
          >

            {deleting
              ? "刪除中..."
              : "🗑️ 刪除獎勵"}

          </button>


        </section>


      </div>


    </main>

  );

}