import React from 'react'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf,faTerminal,faVideo } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
   const navigate = useNavigate();
  return (
    <div className='h-screen snap-y snap-mandatory overflow-y-scroll'>
    <Parallax pages={2} className='parallax' style={{ top: '0', left: '0'}} >
      <ParallaxLayer offset={0} speed={.5} className='w-[100vw] mt-15 h-[52vh] p-10 z-1 flex flex-col snap-start '>
        <h1 className='quicksand-normal text-9xl'>Welcome to</h1>
        <h1 className='quicksand-normal'> Quizz Craft</h1>
      </ParallaxLayer>
      <ParallaxLayer offset={0} speed={1} className='z-2 flex flex-col items-center justify-center p-0 snap-start '>
        <img src="src/assets/op.png" alt=""  className='absolute bottom-0'/>
        <button type='button' className='text-white z-10 pt-3 pb-3 pl-8 pr-8 m-auto font-bold rounded-full cursor-pointer bg-[#1f293c] absolute bottom-0 -translate-y-10'onClick={() => {
              navigate('/MakeQuiz')
            }} >Generate Quiz</button>
      </ParallaxLayer>
      <ParallaxLayer offset={.5} speed={.5} className='h-[50vh] absolute bottom-0 translate-y-1/2'>
      <Info head = {true}/>
      </ParallaxLayer>
      <ParallaxLayer offset={1} speed={.5} className='overflow-hidden'>
        {/* < Join/> */}
      </ParallaxLayer>
    </Parallax>
    </div>
  )
}
function Info({head = false}){
  const navigate = useNavigate();
  return (
    <>
    {/* {head && ( <h1 className='quicksand-normal text-4xl mt-10 mb-10'> Give a try in any one of them !! </h1> )} */}
    <div className='m-auto mt-10 w-[80vw] h-[20vh] flex flex-row gap-10 justify-evenly items-center'>
        {[["PDF to Quiz",faFilePdf], ["Prompt to Quiz",faTerminal], ["Video to Quiz",faVideo]].map((text, index) => (
          <button
            key={index}
            type='button'
            className='text-white z-10 pt-4 pb-4 pl-20 pr-20 font-bold rounded-2xl cursor-pointer bg-[#f73e00]'
            onClick={() => {
              navigate('/MakeQuiz')
            }}
          >
             <FontAwesomeIcon icon={text[1]} />
            {text[0]}
          </button>
        ))}
      </div>

    </>
  )
}