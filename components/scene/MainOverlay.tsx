import React, { useEffect, useState } from 'react'
import { fetchChatResponse } from '@/lib/fetchChatResponse'

type ChatOverlayProps = {
    isChatting: boolean
    setIsChatting: (value: boolean) => void
    onUserMessage: (msg: any) => void
    onAiMessage: (msg: any) => void
}

function MainOverlay({ isChatting, setIsChatting, onUserMessage, onAiMessage }: ChatOverlayProps) {
    const [messages, setMessages] = useState<string[]>([])
    const [showMainChat, setShowMainChat] = useState<boolean>(false)

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const inputValue = e.currentTarget.value.trim()
            if (inputValue) {
                e.currentTarget.value = ''
                await handleSend(inputValue)
            }
        } else if (e.key.toLowerCase() === 'c') {
            setShowMainChat(prev => !prev)
        }
    }

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'c') {
                setShowMainChat(prev => !prev)

            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)

    }, [])

    const handleSend = async (text: string) => {
        setMessages(prev => [...prev, `User: ${text}`])
        onUserMessage(text)

        const response = await fetchChatResponse(text, 'webtrix_expert')
        setMessages(prev => [...prev, `Surreal: ${response}`])
        onAiMessage(response)
    }

    return (
        <>
            <div className="fixed top-0 left-0 w-full bottom-[75px] pt-5 px-5 overflow-y-auto bg-gray-800/90 text-white font-light text-md box-border">
                <div className="mb-2 text-center text-xl">
                </div>
                <iframe
                    src="http://localhost:3001"
                    className="w-full h-full"
                    allowFullScreen
                />
                <div className='mt-3'>
                </div>
                {/*
                <input
                    type="text"
                    placeholder=""
                    className="w-full p-2 border-none rounded text-sm box-border"
                />
                */}
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
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsChatting(true)}
                        onBlur={() => setIsChatting(false)}
                        className="w-full p-2 text-white border-none rounded text-sm box-border"
                    />
                </div>
        </>
    )
}

export default MainOverlay


//   <div className={`fixed top-0 left-0 w-full ${showMainChat ? 'bottom-[75px]' : 'h-full'} pt-5 px-5 overflow-y-auto bg-gray-900/90 text-white font-light text-md box-border`}>
//   <div className={`fixed top-0 left-0 w-full ${showMainChat ? 'bottom-[75px]' : 'bottom-0'} pt-5 px-5 overflow-y-auto bg-gray-900/90 text-white font-light text-md box-border`}>
//<div className="fixed top-0 left-0 w-full h-full pt-5 px-5 overflow-y-auto bg-gray-900/90 text-white font-light text-md box-border">