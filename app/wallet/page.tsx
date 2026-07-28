import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";


export default async function WalletPage() {


  const { data: wallets, error } = await supabase
    .from("wallets")
    .select("*")
    .order("id", {
      ascending: true,
    });


if (error) {
  console.log("Wallet錯誤:", error);
}

console.log("Wallet資料:", wallets);



  return (
    <main className="min-h-screen bg-[#fffaf2] p-5 text-gray-800">


      <div className="mx-auto max-w-md">


        <h1 className="mb-6 text-3xl font-bold">
          🪙 阿寶幣錢包
        </h1>



        <div className="space-y-4">


          {wallets?.map((wallet) => (

            <section
              key={wallet.id}
              className="rounded-3xl bg-white p-5 shadow"
            >


              <h2 className="text-xl font-bold">
                {wallet.user_name}
              </h2>


              <p className="mt-3 text-3xl font-bold">
                🪙 {wallet.balance}
              </p>


              <p className="mt-2 text-gray-500">
                阿寶幣餘額
              </p>


            </section>

          ))}


        </div>


      </div>


      <BottomNav />


    </main>
  );
}