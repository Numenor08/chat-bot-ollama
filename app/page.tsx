import ChatApp from "@/app/ui/chat-app";
import ApiRoute from "@/app/ui/api-route";

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen w-screen">
      <ApiRoute/>
        <ChatApp />
    </main>
  );
}
