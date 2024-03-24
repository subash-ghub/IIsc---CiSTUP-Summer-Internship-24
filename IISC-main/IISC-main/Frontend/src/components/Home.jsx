import React, { useRef, useState } from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import axios from 'axios';

export default function Home() {
    const inputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [before, setBefore] = useState(null);
    const [detected, setDetected] = useState(null);

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setImage(file);
    };
    
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

    const handleSubmit = async () => {
        try {
            let formData = new FormData();
            formData.append('image', image);
            const response = await axios.post('http://localhost:5000/objectdetection', formData, {
                responseType: 'blob', // Ensure response is treated as blob
            });
            if (response.status === 200) {
                setDetected(URL.createObjectURL(response.data)); // Set detected image from response blob
                setBefore(URL.createObjectURL(image)); // Set before image from uploaded image
            }
            setImage(null)
        } catch (error) {
            console.error('Error processing image:', error);
        }
    };
    
    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = detected;
        a.download = 'ObjectDetectedImage.jpg'; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <>
            <div className='h-screen flex flex-col justify-evenly items-center'>
                <div className='flex flex-col justify-center items-center'>
                    <div className='text-4xl font-bold text-center'>
                        Upload Images
                    </div>
                    <div className='text-center font-semibold py-3'>
                        Related to transportation-related images (such as traffic camera images)
                    </div>

                    <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleClick} className="border-gray-300 w-[450px] h-[324px]  rounded-xl flex flex-col justify-center items-center rounded-5 p-4 pt-10 mt-5 pb-10 border-solid border-8 bg-[#D5CFFE]">
                        {
                            image ? <img src={URL.createObjectURL(image)} alt="Uploaded" className='w-full h-full' /> :
                                <>
                                    <p className='text-[#4C4C4C]'>Click to Upload</p>
                                    <p className='text-[#4C4C4C]'>or</p>
                                    <p className='text-[#4C4C4C]'>Drag and Drop Image here</p>
                                </>
                        }
                        <input type="file" onChange={handleFileInputChange} hidden ref={inputRef}/>
                    </div>
                    <div className='pl-80'>
                        <div onClick={()=>setImage(null)} className='text-left font-semibold py-3 cursor-pointer'>
                            Clear selection
                        </div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <button onClick={handleSubmit} className='px-[172px] py-3 rounded-md bg-[#8245E7] text-white font-semibold'>
                            Submit Image
                        </button>
                    </div>
                </div>
            </div>
            {
                before && detected && 
                <div className='flex flex-col items-center justify-evenly'>
                    <div className='text-4xl font-bold py-10'>
                        After Object Detection
                    </div>
                    <div className='flex justify-around py-10'>
                        <div className='px-20'>
                            <img src={before} className='border-solid border-8 border-gray-300 w-[450px] h-[324px] rounded-xl' alt="Before Object Detection" />
                        </div>
                        <div className='px-20 '>
                            <img src={detected} className='border-solid border-8 border-gray-300 w-[450px] h-[324px] rounded-xl' alt="After Object Detection" />
                            <div className='flex justify-end py-5'>
                                <button onClick={handleDownload} className='px-6 py-2 bg-[#8245E7] rounded-md  font-semibold text-white'>
                                    Download Image
                                    <span className='pl-1'>
                                        <FileDownloadOutlinedIcon/>
                                    </span>   
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className='absolute top-[32rem] left-[8rem]'>
                <div className='w-[140px] h-[140px] bg-[#DBDBDB]'></div>
                <div className='w-[140px] h-[140px] bg-[#58FD92] rounded-full -mt-16 ml-12 '></div>
            </div>
            <div className='absolute top-[7rem] right-32'>
                <div className='w-[140px] h-[140px] bg-[#FDCF58] rounded-full '></div>
                <div className='w-[140px] h-[140px] bg-[#58C2FD] rounded-full -mt-20 ml-16 '></div>
            </div>
        </>
    );
}