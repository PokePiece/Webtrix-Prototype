'use client';

import dynamic from 'next/dynamic';

const CanvasWrapper = dynamic(() => import('@/components/webmatrix-proto/CanvasWrapper'), {
    ssr: false,
});

export default function Page() {
    return (
        <main className="w-screen h-screen overflow-hidden relative">
            <CanvasWrapper />

            {/* Overlay HTML */}
            <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
                <div className="flex flex-col justify-center items-center mt-10">
                    <h1 className="text-2xl text-white text-center">Webmatrix</h1>
                    <p className="text-lg text-white text-center">The interconnected sphere of the future that breathes.</p>
                </div>

            </div>
        </main>
    );
}


/*
<div className="mt-10 bg-gray-500 text-black border-gray-300 p-10 m-10 pb-20 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl mb-3">From Heaven Brought Down</h3>
          <p>The Webmatrix connects the world. Envision a future where you don't think; you go.</p>
        </div>

*/