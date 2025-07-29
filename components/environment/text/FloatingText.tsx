import { Html } from '@react-three/drei'
import { useMemo } from 'react'

export default function FloatingText({ text, offsetY }: { text: string; offsetY: number }) {
  const isLong = useMemo(() => text.length > 80, [text])
  const isMedium = useMemo(() => text.length > 40 && text.length <= 80, [text])

  const width = isLong ? 400 : isMedium ? 300 : 200

  return (
    <Html position={[0, 3.3 + offsetY, 0]} center>
      <div
        style={{
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          display: 'inline-block',
          width,
          maxWidth: 400,
        }}
      >
        {text}
      </div>
    </Html>
  )
}
