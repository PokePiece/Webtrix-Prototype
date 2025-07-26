'use client';

import dynamic from 'next/dynamic';

const CanvasWrapper = dynamic(() => import('@/components/webmatrix/CanvasWrapper'), {
  ssr: false, // required to use Three.js APIs in the browser only
});

export default function Page() {
  return (
    <main className="w-screen h-screen overflow-hidden">
      <CanvasWrapper />
    </main>
  );
}
