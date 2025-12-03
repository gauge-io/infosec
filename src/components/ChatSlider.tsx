import { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, Loader2 } from 'lucide-react';
import { useChatSlider } from '@/contexts/ChatSliderContext';
import type { Message } from '@/contexts/ChatSliderContext';
import ReactMarkdown from 'react-markdown';

export function ChatSlider() {
    const { isChatOpen, setIsChatOpen, messages, addMessage } = useChatSlider();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isChatOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isChatOpen]);

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setHasVoiceSupport(true);
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    // Prevent body scroll when slider is open
    useEffect(() => {
        if (isChatOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isChatOpen]);

    // Reset closing state when opening
    useEffect(() => {
        if (isChatOpen) {
            const timer = setTimeout(() => {
                setIsClosing(false);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            setIsClosing(false);
        }
    }, [isChatOpen]);

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText.trim(),
            timestamp: new Date()
        };

        addMessage(userMessage);
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

            addMessage(assistantMessage);
        } catch (error) {
            console.error('Error sending message:', error);

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again or [book a coffee meeting](/coffee) to speak with someone directly.",
                timestamp: new Date()
            };

            addMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleClose = () => {
        setIsClosing(true);
        setIsChatOpen(false);
    };

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/80 z-50 ${isClosing ? '' : 'transition-opacity duration-300 ease-in-out'
                    } ${isChatOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={handleClose}
            />

            {/* Slider Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[700px] bg-card border-l border-border z-50 transform overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isChatOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{
                    willChange: 'transform',
                    pointerEvents: isChatOpen ? 'auto' : 'none',
                    transition: isClosing ? 'none' : 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-fuscia to-mango">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-white">Ask Gauge</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-lg p-4 ${message.role === 'user'
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
                                <div className="bg-muted border border-border rounded-lg p-4 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-fuscia" />
                                    <span className="text-sm text-muted-foreground">Thinking...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-6 border-t border-border bg-card">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a follow-up question..."
                                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuscia text-foreground placeholder-muted-foreground"
                                disabled={isLoading}
                            />
                            {hasVoiceSupport && (
                                <button
                                    type="button"
                                    onClick={toggleVoiceInput}
                                    disabled={isLoading}
                                    className={`px-4 py-2 ${isListening ? 'bg-red-500' : 'bg-muted'
                                        } text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
                                    aria-label="Voice input"
                                >
                                    <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                                </button>
                            )}
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
            </div>
        </>
    );
}
