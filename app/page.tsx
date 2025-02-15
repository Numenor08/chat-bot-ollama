import ChatApp from "@/app/ui/chat-app";
import ApiRoute from "@/app/ui/api-route";

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen w-screen">
      <ApiRoute/>
      <div className="flex flex-col items-center justify-center h-screen w-[80%] min-w-80 max-w-[48rem] gap-20">
        <h1 className="text-4xl text-center">Write the prompt you want below <span className="text-3xl">👇</span></h1>
        <ChatApp />
      </div>
    </main>
  );
}
