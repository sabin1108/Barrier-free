"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const FluidShader = {
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float u_time;
    uniform vec2 u_resolution;
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
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
      vec2 st = vUv;
      float time = u_time * 0.2;

      // Domain warping
      vec2 q = vec2(0.);
      q.x = snoise(st + vec2(0.0, time * 0.5));
      q.y = snoise(st + vec2(1.0, time * 0.5));

      vec2 r = vec2(0.);
      r.x = snoise(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * time);
      r.y = snoise(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * time);

      float f = snoise(st + r);

      // Color palette
      vec3 color1 = vec3(0.1, 0.4, 0.8); // Blue
      vec3 color2 = vec3(0.8, 0.1, 0.5); // Pink
      vec3 color3 = vec3(0.1, 0.8, 0.6); // Teal
      
      vec3 color = mix(color1, color2, clamp(f*f*4.0, 0.0, 1.0));
      color = mix(color, color3, clamp(length(q), 0.0, 1.0));
      color = mix(color, vec3(0.9, 0.9, 1.0), clamp(length(r.x), 0.0, 1.0));

      gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color, 1.);
    }
  `,
};

function Fluid() {
    const mesh = useRef<THREE.Mesh>(null);
    const { size } = useThree();

    const uniforms = useMemo(
        () => ({
            u_time: { value: 0.0 },
            u_resolution: { value: new THREE.Vector2(size.width, size.height) },
        }),
        []
    );

    useFrame((state) => {
        if (mesh.current) {
            const material = mesh.current.material as THREE.ShaderMaterial;
            material.uniforms.u_time.value = state.clock.getElapsedTime();
            material.uniforms.u_resolution.value.set(size.width, size.height);
        }
    });

    return (
        <mesh ref={mesh} scale={[size.width, size.height, 1]}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                vertexShader={FluidShader.vertexShader}
                fragmentShader={FluidShader.fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

export function FluidBackground() {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none">
            <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 1] }}>
                <Fluid />
            </Canvas>
        </div>
    );
}
