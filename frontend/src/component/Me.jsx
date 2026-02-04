import React, { useEffect, useRef } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function Me({ animationName = "idle", ...props }) {
  const group = useRef();

  // 1. Load the model
  const { nodes, materials } = useGLTF("/models/Me.glb");

  // 2. Load Animations (Ensure these match your filenames EXACTLY)
  const idle = useFBX("/models/animations/idle.fbx");
  const clapping = useFBX("/models/animations/clapping.fbx");
  const victory = useFBX("/models/animations/victory.fbx");
  const capoeira = useFBX("/models/animations/Capoeira.fbx");
  const dancing = useFBX("/models/animations/Dancing.fbx");
  const flair = useFBX("/models/animations/Flair.fbx");
  const hiphop = useFBX("/models/animations/Hip-Hop-Dancing.fbx");
  const joyfulJump = useFBX("/models/animations/Joyful-jump.fbx");
  const shuffling = useFBX("/models/animations/Shuffling.fbx");
  const sillyDancing = useFBX("/models/animations/Silly-Dancing.fbx");

  // 3. Name animations nicely
  idle.animations[0].name = "idle";
  clapping.animations[0].name = "clapping";
  victory.animations[0].name = "victory";
  capoeira.animations[0].name = "capoeira";
  dancing.animations[0].name = "dancing";
  flair.animations[0].name = "flair";
  hiphop.animations[0].name = "hiphop";
  joyfulJump.animations[0].name = "joyfulJump";
  shuffling.animations[0].name = "shuffling";
  sillyDancing.animations[0].name = "sillyDancing";

  // 4. Create actions
  const { actions, mixer } = useAnimations(
    [
      idle.animations[0],
      clapping.animations[0],
      victory.animations[0],
      capoeira.animations[0],
      dancing.animations[0],
      flair.animations[0],
      hiphop.animations[0],
      joyfulJump.animations[0],
      shuffling.animations[0],
      sillyDancing.animations[0],
    ],
    group
  );

  useEffect(() => {
    console.log("📄 Animations Loaded:", Object.keys(actions));
    const cleanMixamo = (clip) => {
        if (!clip) return;
        clip.tracks.forEach((track) => {
            track.name = track.name.replace("mixamorig:", "");
            track.name = track.name.replace("mixamorig", "");
        });
    };

    // Apply the fix to all animations
    [
      idle.animations[0], 
      clapping.animations[0], 
      victory.animations[0], 
      capoeira.animations[0],
      dancing.animations[0], 
      flair.animations[0], 
      hiphop.animations[0], 
      joyfulJump.animations[0], 
      shuffling.animations[0], 
      sillyDancing.animations[0]
    ].forEach(cleanMixamo);

  }, [actions]);


  // 5. Play Animation Logic
  useEffect(() => {
    // Safety check: Does the animation exist?
    const action = actions[animationName];

    if (!action) {
        console.error(`❌ Animation '${animationName}' not found! Check typos in Experience.jsx`);
        // Fallback to idle if not found
        actions["idle"]?.reset().fadeIn(0.5).play();
        return;
    }

    // Reset and crossfade
    Object.values(actions).forEach((act) => {
      if (act === action) {
        act.reset().fadeIn(0.5).play();
        act.clampWhenFinished = true; 

        if (animationName === "idle") {
          act.setLoop(THREE.LoopRepeat, Infinity);
        } else {
          act.setLoop(THREE.LoopRepeat, 3);
        }
      } else {
        act.fadeOut(0.5);
      }
    });

    if (animationName !== "idle") {
      const onFinished = (e) => {
        if (e.action === action) {
          action.fadeOut(0.5);
          actions["idle"]?.reset().fadeIn(0.5).play();
          actions["idle"]?.setLoop(THREE.LoopRepeat, Infinity);
        }
      };

      mixer.addEventListener("finished", onFinished);
      return () => mixer.removeEventListener("finished", onFinished);
    }
  }, [animationName, actions, mixer]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={nodes.Hips} />
      {Object.values(nodes).map(
        (node) =>
          node.isSkinnedMesh && (
            <skinnedMesh
              key={node.uuid}
              geometry={node.geometry}
              material={materials[node.material.name]}
              skeleton={node.skeleton}
              morphTargetDictionary={node.morphTargetDictionary}
              morphTargetInfluences={node.morphTargetInfluences}
            />
          )
      )}
    </group>
  );
}

useGLTF.preload("/models/animations/developer.glb");
export default Me;