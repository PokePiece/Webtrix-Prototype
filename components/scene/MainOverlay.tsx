import React, { useState } from 'react'
import { fetchChatResponse } from '@/lib/fetchChatResponse'

type ChatOverlayProps = {
    isChatting: boolean
    setIsChatting: (value: boolean) => void
    onUserMessage: (msg: any) => void
    onAiMessage: (msg: any) => void
}




function MainOverlay({ isChatting, setIsChatting, onUserMessage, onAiMessage }: ChatOverlayProps) {
    const [messages, setMessages] = useState<string[]>([])

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const inputValue = e.currentTarget.value.trim()
            if (inputValue) {
                e.currentTarget.value = ''
                await handleSend(inputValue)
            }
        }
    }


    const handleSend = async (text: string) => {
        setMessages(prev => [...prev, `User: ${text}`])
        onUserMessage(text)

        const response = await fetchChatResponse(text, 'webtrix_expert')
        setMessages(prev => [...prev, `Surreal: ${response}`])
        onAiMessage(response)
    }

    return (
        <>
            <div className="fixed top-0 left-0 w-full bottom-[75px] pt-5 px-5 overflow-y-auto bg-gray-900/90 text-white font-light text-md box-border">
                <div className="mb-2 text-center text-xl">
                    Main Overlay
                </div>
                <div className='mt-3'>
                    Welcome to the Webtrix
                </div>
                <input
                    type="text"
                    placeholder=""
                    className="w-full p-2 border-none rounded text-sm box-border"
                />
            </div>
{/*Chat Overlay under Main */}
            <div className="fixed bottom-0 pb-4 left-0 w-full max-h-[40vh] overflow-y-auto p-4 bg-red/70 text-white font-mono text-sm box-border">
                <div className="mb-7">
                    {messages.map((msg, i) => (
                        <div key={i}>{msg}</div>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Chat..."
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsChatting(true)}
                    onBlur={() => setIsChatting(false)}
                    className="w-full p-2 border-none rounded text-sm box-border"
                />
            </div>

        </>

    )
}

export default MainOverlay