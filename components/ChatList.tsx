import ChatBubble from "./ChatBubble";

type Comment = {
  id: number;
  user_name: string;
  content: string;
  created_at: string;
};

export default function ChatList({
  comments,
}: {
  comments: Comment[];
}) {
  if (comments.length === 0) {
    return (
      <p className="py-10 text-center text-gray-400">
        還沒有任何留言
      </p>
    );
  }

  return (
    <div className="space-y-2">

      {comments.map((comment) => (

        <ChatBubble
          key={comment.id}
          user={comment.user_name}
          content={comment.content}
          createdAt={comment.created_at}
        />

      ))}

    </div>
  );
}