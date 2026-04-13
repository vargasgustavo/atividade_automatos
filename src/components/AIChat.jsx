import React, { useState, useEffect, useRef } from 'react';

export default function AIChat() {
    const [messages, setMessages] = useState([
        { id: 'init', sender: 'bot', text: 'Olá! Sou o SecBot. Como posso ajudar com sua pesquisa de segurança hoje?', html: false }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!apiKey) {
            setTimeout(() => {
                const storedKey = window.prompt("Para usar o SecBot, insira sua chave da API do Gemini:");
                if (storedKey) {
                    localStorage.setItem('gemini_api_key', storedKey);
                    setApiKey(storedKey);
                }
            }, 100);
        }
    }, [apiKey]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = async () => {
        const text = inputValue.trim();
        if (!text) return;

        setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: 'user', text, html: false }]);
        setInputValue('');

        const typingId = 'typing-' + crypto.randomUUID();
        setMessages(prev => [...prev, { id: typingId, sender: 'bot', text: '', isTyping: true }]);

        const responseText = await askGeminiAI(text);

        setMessages(prev => prev.filter(m => m.id !== typingId).concat({
            id: crypto.randomUUID(),
            sender: 'bot',
            text: responseText,
            html: true
        }));
    };

    const askGeminiAI = async (promptUser) => {
        if (!apiKey) return "⚠️ Erro: Chave da API não configurada.";

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
        const systemPrompt = "Você é o SecBot, um assistente virtual especialista em segurança de LLMs. Responda apenas sobre segurança, IA e defesa cibernética de forma curta.";
        const body = {
            contents: [{ parts: [{ text: `${systemPrompt}\n\nPergunta: ${promptUser}` }] }]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (data.error) {
                if (data.error.code === 429) return "⏳ **Aviso:** Limite de cota atingido. Aguarde um minuto.";
                return `⚠️ **Erro:** ${data.error.message}`;
            }
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro na resposta.";
        } catch (error) {
            console.error(error);
            return "Erro de rede ao contatar a IA.";
        }
    };

    const formatText = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    };

    return (
        <main id="ai-chat" className="tab-content" style={{ display: 'block' }}>
            <header className="page-header">
                <h1>SecBot Full Access</h1>
                <p>Consultoria avançada sobre segurança cibernética</p>
            </header>
            <section className="card chat-full-card">
                <div className="chat-full-messages chat-messages" id="chat-messages" style={{ height: '400px', overflowY: 'auto' }}>
                    {messages.map((m) => (
                        <div key={m.id} className={`message ${m.sender}-message`}>
                            <div className="bubble">
                                {m.isTyping ? (
                                    <div className="typing-indicator">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                ) : m.html ? (
                                    <span dangerouslySetInnerHTML={{ __html: formatText(m.text) }}></span>
                                ) : (
                                    m.text
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-full-input-area chat-input-area" style={{ marginTop: '15px' }}>
                    <textarea 
                        rows="1" 
                        placeholder="Digite sua pergunta..." 
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = (e.target.scrollHeight) + 'px';
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="primary-btn send-btn" onClick={sendMessage} style={{ width: 'auto', padding: '0 20px', borderRadius: '12px' }}>Enviar</button>
                </div>
            </section>
        </main>
    );
}
