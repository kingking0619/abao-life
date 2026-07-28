"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import ExchangeButton from "@/components/ExchangeButton";


export default function ShopPage() {

  const [items, setItems] = useState<any[]>([]);
  const [user, setUser] = useState("阿寶");


  useEffect(() => {

    async function loadItems() {

      const res = await fetch("/api/shop-items");

      const data = await res.json();

      setItems(data);

    }


    loadItems();

  }, []);



  return (
    <main className="min-h-screen bg-[#fffaf2] p-5 text-gray-800">


      <div className="mx-auto max-w-md">


        <h1 className="mb-6 text-3xl font-bold">
          🛍️ 阿寶商城
        </h1>



        <section className="mb-5 rounded-3xl bg-white p-5 shadow">


          <h2 className="font-bold">
            兌換人
          </h2>


          <select
            className="mt-3 w-full rounded-2xl bg-gray-100 p-3"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          >

            <option>
              阿寶
            </option>

            <option>
              國王老師
            </option>


          </select>


        </section>




        <div className="space-y-4">


          {items.map((item) => (

            <section
              key={item.id}
              className="rounded-3xl bg-white p-5 shadow"
            >


              <h2 className="text-xl font-bold">
                {item.name}
              </h2>


              <p className="mt-3 text-2xl font-bold">
                🪙 {item.price}
              </p>


              <ExchangeButton
                id={item.id}
                user={user}
              />


            </section>

          ))}


        </div>


      </div>


      <BottomNav />


    </main>
  );
}