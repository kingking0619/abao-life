"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();


  function login(user: "國王老師" | "阿寶") {

    localStorage.setItem("currentUser", user);

    router.push("/");

    router.refresh();

  }


  return (

    <main className="flex min-h-screen items-center justify-center bg-[#fffaf2] p-5">

      <div className="w-full max-w-md">


        <div className="mb-10 text-center">

          <h1 className="text-3xl font-bold">
            阿寶的理想生活
          </h1>

          <p className="mt-3 text-gray-500">
            請選擇你的身分
          </p>

        </div>



        <div className="space-y-4">


          <button
            onClick={() => login("國王老師")}
            className="
              w-full
              rounded-3xl
              bg-white
              p-6
              shadow
              transition
              active:scale-95
            "
          >

            <div className="text-5xl">
              👑
            </div>

            <div className="mt-3 text-xl font-bold">
              國王老師
            </div>

          </button>



          <button
            onClick={() => login("阿寶")}
            className="
              w-full
              rounded-3xl
              bg-white
              p-6
              shadow
              transition
              active:scale-95
            "
          >

            <div className="text-5xl">
              🧸
            </div>

            <div className="mt-3 text-xl font-bold">
              阿寶
            </div>

          </button>


        </div>


        <p className="mt-8 text-center text-sm text-gray-400">
          選擇後會記住你的身分
        </p>


      </div>

    </main>

  );

}