"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import BottomNav from "@/components/BottomNav";
import SortableShopList from "@/components/SortableShopList";
import { useUser } from "@/components/UserContext";


export default function ShopPage() {

  const {
    currentUser,
    loading: userLoading,
  } = useUser();


  const [
    items,
    setItems,
  ] = useState<any[]>([]);

  const [
    loadingItems,
    setLoadingItems,
  ] = useState(true);



  useEffect(() => {

    async function loadItems() {

      try {

        const res =
          await fetch(
            "/api/shop-items"
          );


        const data =
          await res.json();


        if (
          Array.isArray(data)
        ) {

          setItems(data);

        } else {

          setItems([]);

        }

      } catch (error) {

        console.error(
          "載入商城失敗:",
          error
        );

      } finally {

        setLoadingItems(
          false
        );

      }

    }


    loadItems();

  }, []);



  return (

    <main className="min-h-screen bg-[#fffaf2] p-5 pb-28 text-gray-800">


      <div className="mx-auto max-w-md">


        {/* 標題 */}

        <div className="mb-6 flex items-center justify-between gap-3">


          <h1 className="text-3xl font-bold">

            🛍️ 阿寶商城

          </h1>


          <Link
            href="/shop/new"
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
            ＋ 新增獎勵
          </Link>


        </div>



        {/* 目前兌換者 */}

        <section className="mb-5 rounded-3xl bg-white p-4 shadow">


          <p className="text-sm text-gray-500">
            目前兌換者
          </p>


          <p className="mt-1 font-bold">

            {userLoading
              ? "載入中..."
              : currentUser ===
                "國王老師"
              ? "👑 國王老師"
              : currentUser ===
                "阿寶"
              ? "🧸 阿寶"
              : "尚未登入"}

          </p>


        </section>



        {/* 商品列表 */}

        {loadingItems ? (

          <section className="rounded-3xl bg-white p-5 text-gray-400 shadow">

            載入商城中...

          </section>

        ) : items.length === 0 ? (

          <section className="rounded-3xl bg-white p-5 text-center shadow">


            <p className="text-gray-400">
              目前沒有獎勵
            </p>


            <Link
              href="/shop/new"
              className="mt-4 inline-block rounded-2xl bg-black px-4 py-3 font-bold text-white"
            >
              ＋ 建立第一個獎勵
            </Link>


          </section>

        ) : (

          <SortableShopList
            items={items}
          />

        )}


      </div>


      <BottomNav />


    </main>

  );

}