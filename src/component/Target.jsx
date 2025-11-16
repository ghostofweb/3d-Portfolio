/* eslint-disable react/no-unknown-property */
import { useRef, useEffect, useState } from 'react'
import gsap from "gsap"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Loads a remote GLTF and falls back to a local copy in /models/ if the remote fetch fails.
// Success criteria: never throw during render when the remote URL is unreachable.
const Target = (props) => {
  const targetRef = useRef();
  const [gltf, setGltf] = useState(null)

  useEffect(() => {
    const remote = 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target-stand/model.gltf'
    const local = '/models/target-stand/model.gltf' // place model under public/models/target-stand/model.gltf
    const loader = new GLTFLoader()
    let cancelled = false

    const tryLoad = (url, onError) => {
      loader.load(url,
        (res) => { if (!cancelled) setGltf(res) },
        undefined,
        (err) => { onError && onError(err) }
      )
    }

    // First try remote, then fallback to local if remote fails
    tryLoad(remote, (err) => {
      console.warn('[Target] remote model load failed, trying local fallback:', err)
      tryLoad(local, (err2) => {
        console.error('[Target] local fallback also failed:', err2)
      })
    })

    return () => { cancelled = true }
  }, [])

  // Start gsap animation once ref is available
  useEffect(()=>{
    if(!targetRef.current) return
    gsap.to(targetRef.current.position,{
      y: targetRef.current.position.y + 0.5,
      duration: 1.5,
      repeat: -1,
      yoyo:true,
    })
  }, [gltf])

  return (
    <mesh {...props} ref={targetRef} rotation={[0,Math.PI/5,0]}>
      {gltf ? <primitive object={gltf.scene}/> : null}
    </mesh>
  )
}

export default Target