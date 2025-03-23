export interface Message {
    role: "user" | "assistant";
    content: string;
    reasoningTime?: number;
    images?: Uint8Array[] | string[];
}