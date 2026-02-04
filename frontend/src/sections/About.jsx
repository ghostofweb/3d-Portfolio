import React, { useState } from 'react'
import Globe from "react-globe.gl"
import { color, label } from 'three/webgpu';
import Button from '../component/Button';

const About = () => {
const [hasCopied, setHasCopied] = useState(false)

  const handleCopy = ()=>{
    navigator.clipboard.writeText("sahiljeetsinghkalsi@gmail.com");

    setHasCopied(true)

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }
  const N = 20;
  const arcsData = [...Array(N).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: [['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)], ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]]
  }));
  return (
    <section className='c-space my-20' id='about'>
         <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full
         ">
           <div className='col-span-1 xl:row-span-3'>
  <div className="grid-container flex flex-col items-center gap-6 p-6 bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto">
    <img
      src="assets/grid1.png"
      alt="grid-1"
      className="w-full h-auto sm:h-[270px] object-cover rounded-lg"
    />
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-bold text-white">Sup, Sahiljeet here 👋</p>
      <p className="text-gray-300 leading-relaxed mt-4">
        Full-Stack Web Dev who codes for fun, vibes with books 📚, and gets nerdy about philosophy, psychology, and all things brainy. Wanna chat?{' '}
        <a 
          href="mailto:sahiljeetsinghkalsi@gmail.com" 
          className="text-cyan-400 font-medium hover:underline"
        >
          Hit me up!
        </a>
      </p>
    </div>
  </div>
</div>


<div className="col-span-1 xl:row-span-3">
  <div className="grid-container flex flex-col items-center gap-6 p-6 bg-gray-800 rounded-lg shadow-lg">
    <img
      src="assets/grid2.png"
      alt="grid-2"
      className="w-full h-auto sm:h-[270px] object-cover rounded-lg"
    />
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-bold text-white">Tech Stack 💻</p>
      <p className="text-gray-300 leading-relaxed mt-4">
        MERN stack wizard 🧙‍♂️ sprinkling TypeScript magic, diving into Next.js, 
        and crafting immersive Projects. Backends? I tame MongoDB 
        and PostgreSQL. Also Excited About AI stuff 
      </p>
    </div>
  </div>
</div>

    <div className='cols-span-1 xl:row-span-4'>
    <div className='grid-container'>
        <div className='rounded-3xl w-full sm:h-[326] h-fit flex justify-center items-center'>
        <Globe 
  height={326} 
  width={326} 
  backgroundColor="rgba(0,0,0,0)"
  backgroundImageOpacity={0.5}
  showAtmosphere
  showGraticules
  globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
  arcsData={arcsData}
  arcColor={'color'}
  arcDashLength={() => Math.random()}
  arcDashGap={() => Math.random()}
  arcDashAnimateTime={() => Math.random() * 4000 + 500}
  labelsData={[
    {
      lat: 20.5937,
      lng: 78.9629, 
      text: "I'm Here",
      color: "white",
      size:4
    }
  ]}
/>

        </div>
        <div>
          <p className='grid-headtext text-center'>I work remotely across timezones</p>
          <p className='grid-subtext text-center'> Based in India 🇮🇳
            <Button name={"Contact Me"} isBeam containerClass="w-full mt-10"/>
          </p>
        </div>
    </div>
    </div>
    <div className='xl:col-span-2 xl:row-span-3'>
    <div className='grid-container'>
  <img src="/assets/grid3.png" alt="grid3" className='w-full sm:h-[266px] h-fit object-contain'/>
  <div>
    <p className='grid-headtext text-center'>
      My Passion For Coding
    </p>
    <p className='grid-subtext text-center'>
      I love solving problems and building things through code and logic, Love to explore the business logic behind the product
    </p>
  </div>
    </div>
    </div>

    <div className='xl:col-span-1 xl:row-span-2'>
        <div className='grid-container'>
          <img src="/assets/grid4.png" alt="grid-4" className='w-full md:h-[126px] sm:h-[276px] h-fit object-cover sm:object-top'/>
          <div className='space-y-2'>
            <p className='grid-subtext text-center'>Contact Me</p>
            <div className='copy-container' onClick={handleCopy}>
            <img src={hasCopied ? 'assets/tick.svg':"assets/copy.svg"} alt="copy" />
            <p className='lg:text-2xl md:text-xl font-medium text-grey-gradient text-white'>sahiljeetsinghkalsi@gmail.com</p>
            </div>
          </div>
        </div>
    </div>
         </div>
    </section>
  )
}

export default About