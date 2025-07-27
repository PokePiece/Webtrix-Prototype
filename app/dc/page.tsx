'use client';

import dynamic from 'next/dynamic';

const CanvasWrapper = dynamic(() => import('@/components/webmatrix/CanvasWrapper'), {
    ssr: false,
});

export default function Page() {
    return (
        <main className="w-screen h-screen overflow-hidden relative">
            <CanvasWrapper />

            {/* Overlay HTML */}
            <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
                <div className="flex text-black flex-col justify-center items-center mt-10">
                    <h1 className="text-2xl text-black text-center">My Webspace</h1>
                    <p className="text-lg text-black text-center">Welcome to this dimension.</p>
                </div>
                <span className='text-white'></span>
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