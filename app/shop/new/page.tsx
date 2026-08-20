"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function NewShopItemPage() {

  const router = useRouter();


  const [name, setName] = useState("");

  const [price, setPrice] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);



  async function submit() {

    if (!name.trim()) {

      alert("請輸入獎勵名稱");

      return;

    }


    if (
      price === "" ||
      Number(price) < 0
    ) {

      alert("請輸入正確的阿寶幣價格");

      return;

    }


    if (loading) {
      return;
    }


    setLoading(true);


    try {

      const response = await fetch(
        "/api/shop-items",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            name: name.trim(),

            price: Number(price),

            description,

          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        alert(
          data.error ??
          "新增獎勵失敗"
        );

        return;

      }


      router.push("/shop");

      router.refresh();


    } catch (error) {

      console.error(error);

      alert("新增獎勵失敗");

    } finally {

      setLoading(false);

    }

  }



  return (

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
            🎁 新增獎勵
          </h1>



          <div className="mt-5">

            <label className="font-bold">
              獎勵名稱
            </label>


            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="例如：請喝飲料"
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
              onChange={(e) =>
                setPrice(e.target.value)
              }
              placeholder="例如 100"
              className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
            />

          </div>



          <div className="mt-5">

            <label className="font-bold">
              📝 獎勵說明
            </label>


            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
              placeholder="例如：可以指定對方請一杯飲料"
              className="mt-2 w-full rounded-2xl bg-gray-100 p-3"
            />

          </div>



          <button
            type="button"
            onClick={submit}
            disabled={
              loading ||
              !name.trim() ||
              price === ""
            }
            className="
              mt-6
              w-full
              rounded-2xl
              bg-black
              p-4
              font-bold
              text-white
              disabled:opacity-40
            "
          >

            {loading
              ? "建立中..."
              : "🎁 建立獎勵"}

          </button>


        </section>


      </div>


    </main>

  );

}