"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function WalletAdjust({
  user,
}: {
  user: string;
}) {

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);



  async function submit() {

    const value = Number(amount);


    if (
      !Number.isFinite(value) ||
      value === 0
    ) {

      alert("請輸入有效的調整金額");

      return;

    }


    if (loading) {
      return;
    }


    setLoading(true);


    try {

      const response = await fetch(
        "/api/wallet/adjust",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user,
            amount: value,
            reason,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        alert(
          data.error ??
          "調整失敗"
        );

        return;

      }


      setAmount("");
      setReason("");
      setOpen(false);

      router.refresh();


    } catch (error) {

      console.error(error);

      alert("調整失敗");

    } finally {

      setLoading(false);

    }

  }



  return (

    <>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          shrink-0
          rounded-xl
          bg-black
          px-3
          py-2
          text-xs
          font-bold
          text-white
          active:scale-95
        "
      >
        ✨ 神秘力量
      </button>



      {open && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-end
            justify-center
            bg-black/30
            p-4
            sm:items-center
          "
          onClick={() => setOpen(false)}
        >

          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              bg-[#fffaf2]
              p-5
              shadow-2xl
            "
            onClick={(e) => e.stopPropagation()}
          >


            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  ✨ 神秘力量
                </h2>

                <p className="mt-1 text-sm text-gray-500">

                  調整：

                  <span className="ml-1 font-bold">

                    {user === "國王老師"
                      ? "👑 國王老師"
                      : "🧸 阿寶"}

                  </span>

                </p>

              </div>


              <button
                type="button"
                onClick={() => setOpen(false)}
                className="
                  rounded-full
                  bg-white
                  px-3
                  py-2
                  text-gray-500
                  shadow
                "
              >
                ✕
              </button>

            </div>



            <div className="mt-5">

              <label className="font-bold">
                🪙 變動金額
              </label>


              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="例如 50 或 -20"
                className="
                  mt-2
                  w-full
                  rounded-2xl
                  bg-white
                  p-4
                  shadow
                "
              />


              <p className="mt-2 text-xs text-gray-400">
                正數增加，負數扣除
              </p>

            </div>



            <div className="mt-5">

              <label className="font-bold">
                💭 原因
              </label>


              <input
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                placeholder="例如：特別獎勵"
                className="
                  mt-2
                  w-full
                  rounded-2xl
                  bg-white
                  p-4
                  shadow
                "
              />

            </div>



            <button
              type="button"
              onClick={submit}
              disabled={
                loading ||
                !amount
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
                ? "施展中..."
                : "✨ 施展神秘力量"}

            </button>


          </div>

        </div>

      )}

    </>

  );

}