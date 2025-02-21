import { NextRequest } from "next/server";
import ollama from "ollama";

export async function POST(req: NextRequest) {
    try {
        const { messages, model } = await req.json();

        if (!messages || !model) {
            return new Response(JSON.stringify({ error: "Invalid parameter" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Streaming dari Ollama
        const stream = await ollama.chat({
            model: model,
            messages: messages,
            stream: true,
        });

        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const part of stream) {
                        const chunk = JSON.stringify({ content: part.message.content }) + "\n";
                        controller.enqueue(encoder.encode(chunk)); // Kirim JSON per baris
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new Response(readableStream, {
            headers: { "Content-Type": "application/json" }, // Gunakan JSON agar lebih fleksibel
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Terjadi kesalahan: " + error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
