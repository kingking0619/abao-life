"use client";

import { useUser } from "@/components/UserContext";


export default function UserSwitcher() {

  const {
    currentUser,
    switchUser,
    loading,
  } = useUser();


  if (loading) {

    return (
      <div className="rounded-2xl bg-white px-3 py-2 text-sm text-gray-400 shadow">
        載入中...
      </div>
    );

  }


  if (!currentUser) {

    return null;

  }


  const nextUser =
    currentUser === "國王老師"
      ? "阿寶"
      : "國王老師";


  return (

    <button

      type="button"

      onClick={() =>
        switchUser(nextUser)
      }

      className="
        rounded-2xl
        bg-white
        px-3
        py-2
        text-sm
        font-bold
        shadow
        active:scale-95
      "

    >

      <div>

        {currentUser === "國王老師"
          ? "👑 國王老師"
          : "🧸 阿寶"}

      </div>

      <div className="mt-1 text-xs font-normal text-gray-400">
        點擊切換
      </div>

    </button>

  );

}