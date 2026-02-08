import { Canvas } from "@react-three/fiber";
import { workExperiences } from "../constants";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import CanvasLoader from "../component/CanvasLoader";
import Me from "../component/Me";

const ANIMATIONS = [
  "clapping",
  "victory",
  "capoeira",
  "dancing",
  "flair",
  "hiphop",
  "joyfulJump",
  "shuffling",
  "sillyDancing",
];

export const Experince = () => {
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const tooltipRef = useRef(null);

  useEffect(() => {
    setCurrentAnimation("idle");
  }, []);

  const playRandomAnimation = useCallback(() => {
    // Filter out the current animation to ensure a change (forces re-render)
    const availableAnimations = ANIMATIONS.filter(
      (anim) => anim !== currentAnimation
    );

    // If there are no other options (unlikely with >1), fallback to random
    const nextAnimation =
      availableAnimations.length > 0
        ? availableAnimations[Math.floor(Math.random() * availableAnimations.length)]
        : ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];

    setCurrentAnimation(nextAnimation);
  }, [currentAnimation]);

  // --- Tooltip Logic ---
  const handlePointerMove = (e) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${e.clientX + 20}px`;
      tooltipRef.current.style.top = `${e.clientY + 20}px`;
    }
  };

  const handlePointerEnter = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = "1";
      tooltipRef.current.style.visibility = "visible";
    }
  };

  const handlePointerLeave = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = "0";
      tooltipRef.current.style.visibility = "hidden";
    }
  };

  return (
    <section className="c-space my-20">
      {/* Floating Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 px-3 py-1 text-xs font-bold text-black bg-white rounded-md shadow-lg pointer-events-none transition-opacity duration-150"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        Click to animate 👆
      </div>

      <div className="w-full text-white-600">
        <h3 className="head-text">My Work Experince</h3>

        <div className="work-container">
          <div className="work-canvas">
            <Canvas
              shadows
              camera={{ position: [0, 1.5, 7], fov: 60 }}
              gl={{ antialias: true, toneMappingExposure: 1.2 }}
            >
              <Suspense fallback={<CanvasLoader />}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 10]} intensity={2} castShadow />
                <pointLight position={[-5, 3, -5]} intensity={1.2} color="#6aa6ff" />
                <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} castShadow />
                
                <Me
                  position={[0, -3, 0]}
                  scale={3}
                  animationName={currentAnimation}
                />

                <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 2} />
              </Suspense>
            </Canvas>
          </div>

          <div className="work-content">
            <div className="sm:py-10 py-5 sm:px-5 px-2.5">
              {workExperiences.map(({ id, name, pos, duration, title, points, icon }) => (
                <div
                  key={id}
                  className="work-content_container group cursor-pointer"
                  onClick={playRandomAnimation} 
                  onPointerMove={handlePointerMove} 
                  onPointerEnter={handlePointerEnter} 
                  onPointerLeave={handlePointerLeave} 
                >
                  <div className="flex flex-col h-full justify-start items-center py-2">
                    <div className="work-content_logo">
                      <img src={icon} alt={name} className="w-full h-full" />
                    </div>
                    <div className="work-content_bar" />
                  </div>

                  <div className="sm:p-5 px-2.5 py-5">
                    <p className="text-sm font-bold text-white-800">{name}</p>
                    <p className="text-sm mb-3">{pos} — {duration}</p>
                    <p className="mb-4 text-sm group-hover:text-white transition">
                      {title}
                    </p>
                    <ul className="list-disc ml-5 space-y-2 text-sm text-white-600 group-hover:text-white transition">
                      {points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};