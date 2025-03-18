import Dexie from 'dexie';

export interface Thread {
    id: string;
    title: string;
    created_at: Date;
    updated_at: Date;
}

export interface Message {
    id: string;
    thread_id: string;
    role: 'user' | 'assistant';
    content: string;
    image?: string[] | null;
    reasoning_time?: number | null;
    created_at: Date;
}

class ChatBotDB extends Dexie {
    threads!: Dexie.Table<Thread>;
    messages!: Dexie.Table<Message>;
    
    constructor() {
        super("chat-bot-db");

        this.version(1).stores({
            threads: 'id, title, created_at, updated_at',
            messages: 'id, thread_id, role, content, image, reasoning_time, created_at'
        });

        this.threads.hook('creating', (_, obj) => {
            obj.created_at = new Date();
            obj.updated_at = new Date();
        })

        this.messages.hook('creating', (_, obj) => {
            obj.created_at = new Date();
        })
    }

    async createThread(title: string) {
        const id = crypto.randomUUID();

        await this.threads.add({ id, title, created_at: new Date(), updated_at: new Date() });

        return id;
    }

    async getAllThreads() {
        return this.threads.reverse().sortBy('updated_at');
    }

    async createMessage(message: Pick<Message, 'thread_id' | 'role' | 'content' | 'image' | 'reasoning_time'>) {
        const messageId = crypto.randomUUID();

        await this.transaction('rw', this.threads, this.messages, async () => {
            await this.messages.add({ ...message, id: messageId, created_at: new Date() });

            await this.threads.update(message.thread_id, { updated_at: new Date() });
        });

        return messageId;
    }

    async getMessagesByThreadId(threadId: string) {
        return this.messages.where('thread_id').equals(threadId).sortBy('created_at');
    }
}

export const db = new ChatBotDB();