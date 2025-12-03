import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatSliderContextType {
    isChatOpen: boolean;
    setIsChatOpen: (open: boolean) => void;
    messages: Message[];
    addMessage: (message: Message) => void;
    clearMessages: () => void;
}

const ChatSliderContext = createContext<ChatSliderContextType | undefined>(undefined);

export function ChatSliderProvider({ children }: { children: ReactNode }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <ChatSliderContext.Provider value={{
            isChatOpen,
            setIsChatOpen,
            messages,
            addMessage,
            clearMessages
        }}>
            {children}
        </ChatSliderContext.Provider>
    );
}

export function useChatSlider() {
    const context = useContext(ChatSliderContext);
    if (context === undefined) {
        throw new Error('useChatSlider must be used within a ChatSliderProvider');
    }
    return context;
}

export type { Message };
