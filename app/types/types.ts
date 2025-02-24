export interface Messages {
    role: "user" | "assistant";
    content: string;
    reasoningTime?: number;
    images?: Uint8Array[] | string[] | null;
}