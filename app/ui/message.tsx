const MessageList = ({ messages }: { messages: { role: string; text: string }[] }) => {
    return (
      <div className="w-full h-auto max-h-96 overflow-y-auto px-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <span className="max-w-xs px-4 py-2 bg-neutral-100 rounded-3xl tracking-wider">
                {msg.text}
              </span>
            ) : (
              <p className="max-w-xs text-black">{msg.text}</p>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageList;
  