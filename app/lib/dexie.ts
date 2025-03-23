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
    images?: string[] | null;
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
            messages: 'id, thread_id, role, content, images, reasoning_time, created_at'
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
        const threads = await this.threads.reverse().sortBy('updated_at');
        const groupedThreads: Record<string, Thread[]> = {
            Today: [],
            Yesterday: [],
            'Previous 7 Days': [],
            'Previous 30 Days': [],
        };

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        const startOf7DaysAgo = new Date(startOfToday);
        startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 7);
        const startOf30DaysAgo = new Date(startOfToday);
        startOf30DaysAgo.setDate(startOf30DaysAgo.getDate() - 30);

        for (const thread of threads) {
            const updatedAt = new Date(thread.updated_at);

            if (updatedAt >= startOfToday) {
                groupedThreads.Today.push(thread);
            } else if (updatedAt >= startOfYesterday) {
                groupedThreads.Yesterday.push(thread);
            } else if (updatedAt >= startOf7DaysAgo) {
                groupedThreads['Previous 7 Days'].push(thread);
            } else if (updatedAt >= startOf30DaysAgo) {
                groupedThreads['Previous 30 Days'].push(thread);
            } else {
                const year = updatedAt.getFullYear().toString();
                if (!groupedThreads[year]) {
                    groupedThreads[year] = [];
                }
                groupedThreads[year].push(thread);
            }
        }

        return groupedThreads;
    }

    async deleteThread(threadId: string) {
        await this.transaction('rw', this.threads, this.messages, async () => {
            await this.threads.delete(threadId);
            await this.messages.where('thread_id').equals(threadId).delete();
        });
    }

    async updateThread(threadId: string, title: string) {
        await this.threads.update(threadId, { title, updated_at: new Date() });
    }

    async createMessage(message: Pick<Message, 'thread_id' | 'role' | 'content' | 'images' | 'reasoning_time'>) {
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