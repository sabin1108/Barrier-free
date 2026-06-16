"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x *= uResolution.x/uResolution.y;

    vec2 pos = vec2(st * 2.5);
    
    float noise1 = snoise(pos + uTime * 0.1);
    float noise2 = snoise(pos - uTime * 0.15 + vec2(100.0));
    float combinedNoise = snoise(pos + vec2(noise1, noise2) * 1.5 + uTime * 0.2);

    vec3 color1 = vec3(0.02, 0.04, 0.12);
    vec3 color2 = vec3(0.1, 0.02, 0.15);
    vec3 color3 = vec3(0.0, 0.1, 0.2);

    float mixRatio1 = smoothstep(-1.0, 1.0, noise1);
    float mixRatio2 = smoothstep(-1.0, 1.0, combinedNoise);

    vec3 finalColor = mix(color1, color2, mixRatio1);
    finalColor = mix(finalColor, color3, mixRatio2);

    vec2 center = gl_FragCoord.xy/uResolution.xy - vec2(0.5);
    float vignette = 1.0 - smoothstep(0.2, 1.5, length(center));
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

const FluidPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(
        typeof window !== 'undefined' ? window.innerWidth : 1920, 
        typeof window !== 'undefined' ? window.innerHeight : 1080
      ) },
    }),
    []
  )

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  useEffect(() => {
    const handleResize = () => {
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [uniforms])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

export function FluidBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-background overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]}
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance",
          alpha: false 
        }}
      >
        <FluidPlane />
      </Canvas>
    </div>
  )
}
