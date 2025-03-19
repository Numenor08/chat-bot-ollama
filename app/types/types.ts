export interface Messages {
    role: "user" | "assistant";
    content: string;
    reasoningTime?: number;
    image?: Uint8Array[] | string[] | null;
}