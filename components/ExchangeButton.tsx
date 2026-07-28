"use client";

import { useRouter } from "next/navigation";


export default function ExchangeButton({
  id,
  user,
}: {
  id: number;
  user: string;
}) {


  const router = useRouter();


  async function exchange() {


    const response = await fetch(`/api/shop/${id}`, {
      method: "POST",
      body: JSON.stringify({
        user,
      }),
    });



    const result = await response.json();



    if (response.ok) {

      alert("兌換成功！");

      router.refresh();


    } else {

      alert(result.error);

    }


  }



  return (

    <button
      onClick={exchange}
      className="mt-4 w-full rounded-2xl bg-black p-3 text-white"
    >
      兌換
    </button>

  );

}