import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";


export default async function Home() {


  // 取得錢包
  const { data: wallets } = await supabase
    .from("wallets")
    .select("*");


  const abaoWallet =
    wallets?.find((w) => w.user_name === "阿寶");

  const kingWallet =
    wallets?.find((w) => w.user_name === "國王老師");



  // 取得未完成任務
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .neq("status", "已完成")
    .order("created_at", {
      ascending: false,
    });



  // 取得商城商品
  const { data: items } = await supabase
    .from("shop_items")
    .select("*")
    .order("price", {
      ascending: true,
    });



  function canBuy(price:number, balance:number) {
    return balance >= price;
  }



  return (
    <main className="min-h-screen bg-[#fffaf2] p-5 text-gray-800">

      <div className="mx-auto max-w-md">


        <h1 className="mb-6 text-center text-3xl font-bold">
          🏠 阿寶的理想生活
        </h1>



        {/* 錢包 */}

        <section className="mb-5 rounded-3xl bg-white p-5 shadow">

          <h2 className="text-lg font-bold">
            🪙 阿寶幣
          </h2>


          <div className="mt-4 flex justify-between">


            <div>
              <p className="text-sm text-gray-500">
                🧸 阿寶
              </p>

              <p className="text-2xl font-bold">
                {abaoWallet?.balance ?? 0} 🪙
              </p>
            </div>



            <div>
              <p className="text-sm text-gray-500">
                👑 國王老師
              </p>

              <p className="text-2xl font-bold">
                {kingWallet?.balance ?? 0} 🪙
              </p>
            </div>


          </div>

        </section>





        {/* 任務 */}

        <section className="mb-5 rounded-3xl bg-white p-5 shadow">


          <h2 className="text-lg font-bold">
            📋 待完成任務
          </h2>



          <div className="mt-4 space-y-3">


            {tasks?.slice(0,3).map((task)=>(

              <div
                key={task.id}
                className="rounded-2xl bg-[#fff5dc] p-4"
              >

                <p className="font-bold">
                  {task.title}
                </p>


                <p>
                  +{task.reward} 阿寶幣
                </p>


              </div>

            ))}



            {(!tasks || tasks.length === 0) && (

              <p className="text-gray-500">
                🎉 目前沒有待完成任務
              </p>

            )}


          </div>


        </section>





        {/* 商城 */}

        <section className="rounded-3xl bg-white p-5 shadow">


          <h2 className="text-lg font-bold">
            🛍️ 獎勵商城
          </h2>



          <div className="mt-4 space-y-3">


          {items?.slice(0,3).map((item)=>(

            <div
              key={item.id}
              className="rounded-2xl bg-gray-50 p-4"
            >

              <p className="font-bold">
                {item.name}
              </p>


              <p>
                🪙 {item.price}
              </p>


              {
                canBuy(
                  item.price,
                  abaoWallet?.balance ?? 0
                )

                ?

                <p className="text-sm text-green-600">
                  ✅ 阿寶可以兌換
                </p>

                :

                <p className="text-sm text-gray-500">
                  還差 {item.price - (abaoWallet?.balance ?? 0)} 🪙
                </p>

              }


            </div>

          ))}


          </div>


        </section>




        <BottomNav />


      </div>

    </main>
  );
}