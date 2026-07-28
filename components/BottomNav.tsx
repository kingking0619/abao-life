import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-5 left-1/2 flex w-[90%] max-w-md -translate-x-1/2 justify-around rounded-3xl bg-white p-4 shadow-lg">

      <Link href="/">
        <div className="flex flex-col items-center">
          <span>🏠</span>
          <small>首頁</small>
        </div>
      </Link>


      <Link href="/tasks">
        <div className="flex flex-col items-center">
          <span>📋</span>
          <small>任務</small>
        </div>
      </Link>


      <Link href="/wallet">
        <div className="flex flex-col items-center">
          <span>🪙</span>
          <small>錢包</small>
        </div>
      </Link>


      <Link href="/shop">
        <div className="flex flex-col items-center">
          <span>🛍️</span>
          <small>商城</small>
        </div>
      </Link>


      <Link href="/settings">
        <div className="flex flex-col items-center">
          <span>⚙️</span>
          <small>設定</small>
        </div>
      </Link>

    </nav>
  );
}