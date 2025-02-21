import { NextResponse } from "next/server";
import ollama from "ollama";

export async function GET() {
    try {
        const listModels = await ollama.list()
        return NextResponse.json(listModels)
    } catch (error) {
        return NextResponse.json({ error: "Error: " + error }, { status: 500 })
    }
}