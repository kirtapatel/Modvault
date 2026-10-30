"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile, useReducedMotion } from "@/lib/useMediaQuery";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;

  attribute float aScale;
  attribute vec3 aColor;

  varying vec3 vColor;

  void main() {
    vColor = aColor;

    vec3 p = position;
    p.y += sin(uTime * 0.18 + p.x * 0.25) * 0.32;
    p.x += cos(uTime * 0.12 + p.z * 0.22) * 0.24;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * aScale * (1.0 / max(0.001, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    float alpha = smoothstep(0.5, 0.0, dist);
    alpha *= alpha;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

const palette = ["#1bd96a", "#22d3ee", "#7dffc4", "#d9fff0", "#8b5cf6"];

function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function Starfield() {
  const mobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const count = mobile ? 650 : 2200;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: mobile ? 36 : 46 },
    }),
    [mobile],
  );

  const { positions, colors, scales } = useMemo(() => {
    const random = createRandom(count * 7919 + 17);
    const positionArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);
    const scaleArray = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      positionArray[i * 3] = (random() - 0.5) * 30;
      positionArray[i * 3 + 1] = (random() - 0.5) * 20;
      positionArray[i * 3 + 2] = -random() * 18 + 4;

      const color = new THREE.Color(
        palette[Math.floor(random() * palette.length)],
      );
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;

      scaleArray[i] = random() < 0.08 ? 2.2 : 0.45 + random() * 1.4;
    }

    return {
      positions: positionArray,
      colors: colorArray,
      scales: scaleArray,
    };
  }, [count]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const shader = material.current;

    if (shader) {
      shader.uniforms.uTime.value += reducedMotion ? 0 : delta;
    }

    if (!group.current) return;

    const targetY = reducedMotion ? 0 : pointer.current.x * 0.22;
    const targetX = reducedMotion ? 0 : -pointer.current.y * 0.16;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetY,
      0.035,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      0.035,
    );

    if (!reducedMotion) {
      group.current.position.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.8;
    }
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
