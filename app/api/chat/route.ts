import { NextRequest, NextResponse } from 'next/server';
import ollama from 'ollama';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        
        if (!prompt) {
            return NextResponse.json({ error: "Prompt tidak boleh kosong" }, { status: 400 });
        }
        
        const response = await ollama.chat({
            model: "deepseek-r1",
            messages: [{role: "user", content: prompt}],
        })

        return NextResponse.json({ message: response.message.content });

    } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}