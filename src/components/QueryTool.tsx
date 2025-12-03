import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const STARTER_PROMPTS = [
    "What services does Gauge.io offer?",
    "Show me case studies",
    "How can I book a meeting?",
    "Tell me about Gauge's approach to UX research"
];

export function QueryTool() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Listen for openQueryTool events from hero badges
    useEffect(() => {
        const handleOpenQueryTool = (event: Event) => {
            const customEvent = event as CustomEvent<{ prompt: string }>;
            if (customEvent.detail?.prompt) {
                setIsOpen(true);
                // Wait a moment for the chat to open, then send the prompt
                setTimeout(() => {
                    sendMessage(customEvent.detail.prompt);
                }, 300);
            }
        };

        window.addEventListener('openQueryTool', handleOpenQueryTool);
        return () => {
            window.removeEventListener('openQueryTool', handleOpenQueryTool);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/.netlify/functions/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: messageText })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.answer,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again or [book a coffee meeting](/coffee) to speak with someone directly.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleStarterPrompt = (prompt: string) => {
        sendMessage(prompt);
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-fuscia to-mango text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                    aria-label="Open AI Assistant"
                >
                    <div className="relative">
                        <MessageCircle className="w-6 h-6" />
                        <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
                    </div>
                </button>
            )}

            {/* Chat Interface */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-md h-[600px] flex flex-col bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-fuscia to-mango p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-white" />
                            <h3 className="text-lg font-semibold text-white">Ask About Gauge</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                        {messages.length === 0 && (
                            <div className="space-y-4">
                                <div className="text-center text-muted-foreground text-sm">
                                    <p className="mb-4">👋 Hi! I'm here to help you learn about Gauge.io.</p>
                                    <p className="mb-2 font-medium">Try asking:</p>
                                </div>
                                <div className="space-y-2">
                                    {STARTER_PROMPTS.map((prompt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleStarterPrompt(prompt)}
                                            className="w-full text-left p-3 bg-muted hover:bg-accent rounded-lg text-sm transition-colors border border-border hover:border-fuscia"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-lg p-3 ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-fuscia to-mango text-white'
                                        : 'bg-muted text-foreground border border-border'
                                        }`}
                                >
                                    {message.role === 'assistant' ? (
                                        <div className="prose prose-sm prose-invert max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    a: ({ node, ...props }) => (
                                                        <a
                                                            {...props}
                                                            className="text-fuscia hover:text-mango underline"
                                                            target={props.href?.startsWith('http') ? '_blank' : undefined}
                                                            rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                        />
                                                    ),
                                                    p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                                                    ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 mb-2" />,
                                                    ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 mb-2" />,
                                                    strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-white" />,
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-sm">{message.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted border border-border rounded-lg p-3 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-fuscia" />
                                    <span className="text-sm text-muted-foreground">Thinking...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about services, case studies, or booking..."
                                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuscia text-foreground placeholder-muted-foreground"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="px-4 py-2 bg-gradient-to-r from-fuscia to-mango text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                aria-label="Send message"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
