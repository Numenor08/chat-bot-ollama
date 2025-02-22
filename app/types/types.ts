export interface Messages {
    role: "user" | "assistant";
    content: string;
    reasoningTime?: number;
}