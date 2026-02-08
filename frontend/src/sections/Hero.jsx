import { Leva } from 'leva';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMediaQuery } from 'react-responsive';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'; // Import Stars
import { calculateSizes } from '../constants/index.js';
import CanvasLoader from '../component/CanvasLoader';
import HackerRoom from '../component/HackerRoom.jsx';
import Target from '../component/Target.jsx';
import ReactLogo from '../component/ReactLogo.jsx';
import Cube from '../component/Cube.jsx';
import Rings from '../component/Rings.jsx';
import Button from '../component/Button.jsx';

const Hero = () => {
  // Use media queries to determine screen size
  const isSmall = useMediaQuery({ maxWidth: 440 });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });

  const sizes = calculateSizes(isSmall, isMobile, isTablet);

  // Function to disable right-click context menu
  const handleRightClick = (e) => {
    e.preventDefault(); // Prevent the default right-click menu
  };

  return (
    <section className="min-h-screen w-full flex flex-col relative" id="home">
      <div className="w-full mx-auto flex flex-col sm:mt-36 mt-20 c-space gap-3">
        <p className="sm:text-3xl text-xl font-medium text-white text-center font-generalsans">
          Sahiljeet This Side <span className="waving-hand">👋</span>
        </p>
        <p className="hero_tag text-gray_gradient">Full Stack Dev<span className='text-black'>🧑‍💻💻</span></p>
      </div>

      {/* Make sure the canvas and page can scroll while still allowing 3D interactions */}
      <div 
        className="w-full h-full absolute inset-0" 
        style={{ overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onContextMenu={handleRightClick}  // Disable right-click menu on this div
      >
        <Canvas className="w-full h-full">
          <Suspense fallback={<CanvasLoader />}>
            {/* To hide controller */}
            <Leva hidden />
            <PerspectiveCamera makeDefault position={[0, 0, 20]} />
            
            {/* Use OrbitControls for 3D interactions, but prevent scroll zooming */}
                    <OrbitControls 
          enableZoom={false}   // Disable zoom via mouse scroll
          enablePan={true}     // Allow panning (dragging)
          enableRotate={true}  // Allow rotating (dragging)
          minZoom={1.5}        // Set minimum zoom level
          maxZoom={4}          // Set maximum zoom level
          mouseButtons={{ LEFT: 0, MIDDLE: 1, RIGHT: null }} // Disable right-click for rotating
          minPolarAngle={Math.PI / 2.5} // Restrict upward rotation (angle in radians)
          maxPolarAngle={Math.PI / 1.7} // Restrict downward rotation (angle in radians)
/>
            
            {/* Stars in the background */}
            <Stars 
              radius={100}          // Radius of the sphere where stars are placed
              depth={50}            // Starfield depth
              count={5000}          // Number of stars
              factor={4}            // Size of stars
              saturation={0}        // Color saturation
              fade={true}           // Adds fading to stars
            />

            {/* Adjusted position to move HackerRoom down */}
            <HackerRoom 
              scale={sizes.deskScale} 
              position={[sizes.deskPosition[0], sizes.deskPosition[1] - 2, sizes.deskPosition[2]]} 
              rotation={[0.1, -Math.PI, 0]} 
            />

            <group>
              <Target position={sizes.targetPosition}/>
              <ReactLogo position={sizes.reactLogoPosition}/>
              <Cube position={sizes.cubePosition}/>
              <Rings position={sizes.ringPosition}/>
            </group>

            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 10]} intensity={0.5} />
          </Suspense>
        </Canvas>
        </div>
        <div className='absolute bottom-7 left-0 w-full z-10 c-space'>
        <a href="#contact" className='w-fit'>
        <Button name="Connect with me ☕" isBeam containerClass="sm:w-fit w-full sm:min-w-9"></Button>

        </a>
        </div>
    </section>
  );
};

export default Hero;
