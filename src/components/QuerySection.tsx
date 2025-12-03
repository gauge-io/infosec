import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { useChatSlider } from '@/contexts/ChatSliderContext';
import type { Message } from '@/contexts/ChatSliderContext';

const quickQuestions = [
    'Has Gauge done work in FinTech?',
    'Do you have expertise in InfoSec?',
    'What is your research approach?',
    'How do you validate solutions?'
];

export function QuerySection() {
    const { setIsChatOpen, addMessage } = useChatSlider();
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
    const recognitionRef = useRef<any>(null);

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

    const sendQuery = async (question: string) => {
        if (!question.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: question.trim(),
            timestamp: new Date()
        };
        addMessage(userMessage);

        // Open the chat slider
        setIsChatOpen(true);

        // Clear input
        setInput('');

        // Send to API
        try {
            const response = await fetch('/.netlify/functions/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
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
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendQuery(input);
    };

    const handleQuickQuestion = (question: string) => {
        sendQuery(question);
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
        <section className="relative pt-28 md:pt-32 pb-16 px-6 lg:px-12 bg-gray-900 border-b-[5px] border-blue">
            <div className="w-full max-w-7xl mx-auto">
                {/* Query Input - 20% larger */}
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex gap-3 max-w-4xl mx-auto">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="What can Gauge help you with today?"
                                className="w-full px-7 py-5 bg-black border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mango text-white placeholder-gray-400 text-xl font-sans"
                                autoFocus
                            />
                        </div>
                        {hasVoiceSupport && (
                            <button
                                type="button"
                                onClick={toggleVoiceInput}
                                className={`px-5 py-5 ${isListening ? 'bg-red-500' : 'bg-black border-2 border-gray-700'
                                    } text-white rounded-lg hover:opacity-90 transition-opacity`}
                                aria-label="Voice input"
                            >
                                <Mic className={`w-7 h-7 ${isListening ? 'animate-pulse' : ''}`} />
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="px-7 py-5 bg-mango text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-semibold text-2xl"
                            aria-label="Send query"
                        >
                            <Send className="w-7 h-7" />
                        </button>
                    </div>
                </form>

                {/* Quick Question Buttons - 2x2 Grid */}
                <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {quickQuestions.map((question, index) => (
                        <button
                            key={index}
                            onClick={() => handleQuickQuestion(question)}
                            className="px-5 py-4 bg-black border border-gray-600 text-white rounded-lg hover:bg-gray-700 hover:border-mango transition-all text-xl font-sans text-center"
                        >
                            {question}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
