import { NextRequest } from "next/server";
import ollama from "ollama";

export async function POST(req: NextRequest) {
    try {
        const { prompt, model } = await req.json();

        if (!prompt.trim()) {
            return new Response("Prompt tidak boleh kosong", { status: 400 });
        }

        // Streaming dari Ollama
        const stream = await ollama.chat({
            model: model,
            messages: [{ role: "user", content: prompt.trim() }],
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
