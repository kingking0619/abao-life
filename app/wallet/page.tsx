import BottomNav from "@/components/BottomNav";
import WalletAdjust from "@/components/WalletAdjust";
import { supabase } from "@/lib/supabase";


function getUserIcon(name:string){

  return name === "國王老師"
    ? "👑"
    : "🧸";

}


function formatDate(date:string){

  const d = new Date(date);

  return (
    `${d.getMonth()+1}/${d.getDate()} ` +
    `${String(d.getHours()).padStart(2,"0")}:` +
    `${String(d.getMinutes()).padStart(2,"0")}`
  );

}


function getTypeLabel(type:string){

  if(type === "task_reward"){
    return "任務獎勵";
  }

  if(type === "shop"){
    return "商城消費";
  }

  if(type === "penalty"){
    return "任務扣款";
  }

  if(type === "adjustment"){
    return "神秘力量";
  }

  return type;

}


export default async function WalletPage() {


  const {
    data: wallets,
    error: walletError,
  } = await supabase
    .from("wallets")
    .select("*")
    .order("id", {
      ascending:true,
    });



  const {
    data: transactions,
    error: transactionError,
  } = await supabase
    .from("wallet_transactions")
    .select("*")
    .order("created_at", {
      ascending:false,
    });



  if(walletError){
    console.log(
      "Wallet錯誤:",
      walletError
    );
  }


  if(transactionError){
    console.log(
      "交易紀錄錯誤:",
      transactionError
    );
  }



  const allTransactions =
    transactions ?? [];



  return (

    <main className="min-h-screen bg-[#fffaf2] p-5 pb-32 text-gray-800">


      <div className="mx-auto max-w-md">


        <h1 className="mb-6 text-3xl font-bold">
          🪙 阿寶幣錢包
        </h1>



        {/* 雙人餘額 */}

        <div className="space-y-4">


          {wallets?.map((wallet)=>(

            <section
              key={wallet.id}
              className="rounded-3xl bg-white p-5 shadow"
            >


              <div className="flex items-start justify-between gap-3">


                <div>

                  <h2 className="text-xl font-bold">

                    {getUserIcon(wallet.user_name)}

                    {" "}

                    {wallet.user_name}

                  </h2>


                  <p className="mt-3 text-3xl font-bold">

                    🪙 {wallet.balance}

                  </p>


                  <p className="mt-1 text-sm text-gray-400">
                    目前餘額
                  </p>

                </div>



                <WalletAdjust
                  user={wallet.user_name}
                />


              </div>


            </section>

          ))}


        </div>



        {/* 最近交易 */}

        <section className="mt-6 rounded-3xl bg-white p-5 shadow">


          <h2 className="text-xl font-bold">
            📒 最近交易
          </h2>



          <div className="mt-4 space-y-3">


            {allTransactions.length === 0 ? (

              <p className="text-gray-400">
                目前沒有交易紀錄
              </p>

            ) : (

              allTransactions
                .slice(0,20)
                .map((transaction)=>(

                  <div
                    key={transaction.id}
                    className="rounded-2xl bg-gray-50 p-4"
                  >


                    <div className="flex items-start justify-between gap-3">


                      <div>

                        <p className="font-bold">

                          {getUserIcon(
                            transaction.user_name
                          )}

                          {" "}

                          {transaction.user_name}

                        </p>


                        <p className="mt-1 text-sm text-gray-600">

                          {
                            transaction.description
                            ||
                            getTypeLabel(
                              transaction.transaction_type
                            )
                          }

                        </p>

                      </div>



                      <p
                        className={
                          transaction.amount >= 0
                            ? "shrink-0 text-lg font-bold text-green-600"
                            : "shrink-0 text-lg font-bold text-red-500"
                        }
                      >

                        {
                          transaction.amount >= 0
                            ? "+"
                            : ""
                        }

                        {transaction.amount}

                      </p>


                    </div>



                    <div className="mt-2 flex items-center justify-between">


                      <span className="text-xs text-gray-400">

                        {
                          getTypeLabel(
                            transaction.transaction_type
                          )
                        }

                      </span>


                      <span className="text-xs text-gray-400">

                        {formatDate(
                          transaction.created_at
                        )}

                      </span>


                    </div>


                  </div>

                ))

            )}


          </div>


        </section>


      </div>


      <BottomNav />


    </main>

  );

}