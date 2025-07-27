// components/ChatOverlay.tsx
import { Html } from '@react-three/drei'
import React, { useState } from 'react'
//import { controlsEnabledRef } from './ThirdPersonCamera'
import { fetchChatResponse } from '@/lib/fetchChatResponse'

type ChatOverlayProps = {
    isChatting: boolean
    setIsChatting: (value: boolean) => void
    onUserMessage: (msg: any) => void
    onAiMessage: (msg: any) => void
}


export default function ChatOverlay({ isChatting, setIsChatting, onUserMessage, onAiMessage }: ChatOverlayProps) {
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

        const response = await fetchChatResponse(text)
        setMessages(prev => [...prev, `Sur: ${response}`])
        onAiMessage(response)
    }


    return (

        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                maxHeight: '40vh',
                overflowY: 'auto',
                padding: '1rem',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '14px',
                boxSizing: 'border-box',
            }}
        >

            <div style={{ marginBottom: '0.5rem' }}>
                {messages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                placeholder="Say something..."
                onKeyDown={handleKeyDown}
                onFocus={() => setIsChatting(true)}
                onBlur={() => setIsChatting(false)}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                }}
            />

        </div>

    )
}
