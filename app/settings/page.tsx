import BottomNav from "@/components/BottomNav";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#fffaf2] p-5 text-gray-800">

      <div className="mx-auto max-w-md">

        <h1 className="mb-6 text-3xl font-bold">
          ⚙️ 設定
        </h1>


        <section className="space-y-4">


          <div className="rounded-3xl bg-white p-5 shadow">
            <h2 className="font-bold">
              👥 阿寶小屋
            </h2>

            <p className="mt-2 text-gray-500">
              Yu-Tse & Partner
            </p>
          </div>


          <div className="rounded-3xl bg-white p-5 shadow">
            <h2 className="font-bold">
              🔔 通知設定
            </h2>

            <p className="mt-2 text-gray-500">
              開啟任務提醒與兌換通知
            </p>
          </div>


          <div className="rounded-3xl bg-white p-5 shadow">
            <h2 className="font-bold">
              🪙 阿寶幣規則
            </h2>

            <p className="mt-2 text-gray-500">
              管理任務獎勵設定
            </p>
          </div>


        </section>


        <BottomNav />

      </div>

    </main>
  );
}