import { fetchWMChatResponse } from "@/lib/fetchWMChatResponse";
import React, { useEffect, useState } from 'react'

const NodeOverlays = ({ showVoid, setShowVoid, setIsChatting }: { showVoid: boolean, setIsChatting: (value: boolean) => void, setShowVoid: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const [messages, setMessages] = useState<string[]>([])

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, userTag: string) => {
        if (e.key === 'Enter') {
            const inputValue = e.currentTarget.value.trim()
            if (inputValue) {
                e.currentTarget.value = ''
                await handleSend(inputValue, userTag)
            }
        }
    }

    const handleSend = async (text: string, tag: string) => {
        setMessages(prev => [...prev, `User: ${text}`])

        const response = await fetchWMChatResponse(text, tag)
        setMessages(prev => [...prev, `Surreal: ${response}`])
    }

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'escape') {
                setShowVoid(false)
            } else if (e.key.toLowerCase() === 'alt') {
                setMessages([])
            }
        }

        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    return (
        <>
            {showVoid && (
                <>
                    <div className="fixed left-[25px] top-5 w-[calc(100%-50px)] bottom-[75px] bg-white/98 text-white font-light text-md box-border flex flex-col">
                        <div className="mb-2 text-center text-xl px-5 pt-5">
                        </div>
                        <div className="flex-1 px-5 pb-5 overflow-auto">
                            <iframe
                                src="http://intelligence.dilloncarey.com"
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>
                    </div>
                    <div className="fixed bottom-0 pb-4 text-white left-0 w-full max-h-[40vh] overflow-y-auto p-4 bg-gray-900/90 text-white font-mono text-sm box-border">
                        <div className="mb-2">
                            {messages.map((msg, i) => (
                                <div key={i}>{msg}</div>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Chat..."
                            onKeyDown={(e) => handleKeyDown(e, 'general')}
                            onFocus={() => setIsChatting(true)}
                            onBlur={() => setIsChatting(false)}
                            className="w-full p-2 text-white border-none rounded text-sm box-border"
                        />
                    </div>
                </>
            )}

        </>
    );
};

export default NodeOverlays;

/*
<div className="fixed top-[25px] bottom-[25px] left-1/2 -translate-x-1/2 w-[calc(100%-10rem)] pt-5 px-5 overflow-y-auto bg-white/98 text-white font-light text-md box-border">
                    <iframe
                        src="http://intelligence.dilloncarey.com"
                        className="w-full h-full"
                        allowFullScreen
                    />
                </div>

                
                */