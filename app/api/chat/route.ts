import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(req: NextRequest) {
    try {
        const { messages, model } = await req.json();

        if (!messages || !model) {
            return new NextResponse(JSON.stringify({ error: "Invalid parameter" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const stream = await ollama.chat({
            model: model,
            messages: messages,
            stream: true,
        });

        let startReasoning: number | null = null;
        let reasoningTime: number = 0;
        let aborted = false;

        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const part of stream) {
                        if (aborted) break;
                        if (part.message.content.includes("<think>")) {
                            startReasoning = Date.now();
                        }
                        if (part.message.content.includes("</think>") && startReasoning !== null) {
                            const endReasoning = Date.now();
                            reasoningTime = Math.floor((endReasoning - startReasoning) / 1000);
                            startReasoning = null;
                        }

                        const chunk = JSON.stringify({ content: part.message.content, reasoningTime }) + "\n";
                        controller.enqueue(encoder.encode(chunk));
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new NextResponse(readableStream, {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: "Terjadi kesalahan: " + error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
