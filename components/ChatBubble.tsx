type Props = {
  user: string;
  content: string;
  createdAt: string;
};

export default function ChatBubble({
  user,
  content,
  createdAt,
}: Props) {

  const isAbao = user === "阿寶";

  return (

    <div
      className={`flex mb-5 ${
        isAbao
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div
        className={`max-w-[75%] ${
          isAbao
            ? "items-end"
            : "items-start"
        } flex flex-col`}
      >

        <p className="mb-1 text-xs text-gray-500">
          {isAbao ? "🧸 阿寶" : "👑 國王老師"}
        </p>

        <div
          className={`rounded-3xl px-4 py-3 shadow ${
            isAbao
              ? "bg-yellow-100"
              : "bg-white"
          }`}
        >

          <p className="whitespace-pre-wrap">
            {content}
          </p>

        </div>

        <p className="mt-1 text-xs text-gray-400">

          {new Date(createdAt).toLocaleTimeString(
            "zh-TW",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}

        </p>

      </div>

    </div>

  );
}