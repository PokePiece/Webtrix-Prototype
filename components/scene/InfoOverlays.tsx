import React from 'react'

interface InfoOverlaysProps {
    showVoidInfo: boolean
    setShowVoidInfo: React.Dispatch<React.SetStateAction<boolean>>
    showTreeInfo: boolean
    setShowTreeInfo: React.Dispatch<React.SetStateAction<boolean>>
}

const InfoOverlays = ({ showVoidInfo, setShowVoidInfo, showTreeInfo, setShowTreeInfo }: InfoOverlaysProps) => {
    return (
        <>
            {showVoidInfo && (

                <div>
                    <div className="absolute top-4 left-4 bg-white text-black p-4 rounded shadow z-50">
                        <p><strong>Name:</strong> Void Cloud Intelligence</p>
                        <p><strong>Description:</strong> Repository of Intelligence in the Cloud</p>
                        <p><strong>Website:</strong>https://intelligence.dilloncarey.com</p>
                        {/*<p><strong>Webspace:</strong></p> */}


                        <button
                            className="mt-2 bg-gray-200 px-2 py-1 rounded"
                            onClick={() => setShowVoidInfo(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {showTreeInfo && (

                <div>
                    <div className="absolute top-4 left-4 bg-white text-black p-4 rounded shadow z-50">
                        <p><strong>Name:</strong> Tree</p>
                        <p><strong>Description:</strong> An oak or other tree. Clicking it nets 1 wood.</p>
                        {/*<p><strong>Webspace:</strong></p> */}


                        <button
                            className="mt-2 bg-gray-200 px-2 py-1 rounded"
                            onClick={() => setShowTreeInfo(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default InfoOverlays

{/*<p><strong>Wikipedia:</strong> {selectedBuilding.website ?? "—"}</p>*/ }