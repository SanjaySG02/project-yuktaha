"use client";



import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

import * as THREE from 'three';
import React, { useEffect } from 'react';

// Preload the model (must be before component definitions)
useGLTF.preload('/stylized_anime_female_head/scene.gltf');


function FaceModel({ texture }) {
  const { scene } = useGLTF('/stylized_anime_female_head/scene.gltf');
  useEffect(() => {
    if (texture) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.map = texture;
          child.material.needsUpdate = true;
        }
      });
    }
  }, [texture, scene]);
  return <primitive object={scene} />;
}

function TextureLoader({ image, onTexture }) {
  useEffect(() => {
    if (!image) return;
    const loader = new THREE.TextureLoader();
    loader.load(image, (tex) => {
      tex.flipY = false;
      onTexture(tex);
    });
  }, [image, onTexture]);
  return null;
}


export default function FaceViewer({ imageUrl }) {
  const [texture, setTexture] = React.useState(null);
  // Responsive sizing: width 30vw (min 300px, max 500px), height auto
  return (
    <div style={{ width: 'min(30vw, 500px)', minWidth: '300px', aspectRatio: '4/5', background: 'transparent', border: 'none', boxShadow: 'none', borderRadius: 0, overflow: 'visible' }}>
      <Canvas camera={{ position: [0, 0, 3.5], fov: 40 }} style={{ background: 'none', width: '100%', height: '100%' }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={1.2} />
        <FaceModel texture={texture} scale={0.4} />
        <OrbitControls enablePan={false} enableZoom={false} />
        {/* TextureLoader is disabled to keep the original face color */}
        {/* {imageUrl && <TextureLoader image={imageUrl} onTexture={setTexture} />} */}
      </Canvas>
    </div>
  );
}
