"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Float, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile, useReducedMotion } from "@/lib/useMediaQuery";

const BOLTS: [number, number][] = [
  [-1.14, -1.14],
  [1.14, -1.14],
  [-1.14, 1.14],
  [1.14, 1.14],
];

function Vault({ mobile }: { mobile: boolean }) {
  const reducedMotion = useReducedMotion();
  const root = useRef<THREE.Group>(null);
  const leftDoor = useRef<THREE.Group>(null);
  const rightDoor = useRef<THREE.Group>(null);
  const lockRing = useRef<THREE.MeshStandardMaterial>(null);
  const lockBars = useRef<THREE.MeshStandardMaterial>(null);
  const innerGlow = useRef<THREE.PointLight>(null);
  const hovered = useRef(false);
  const openAmount = useRef(0);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const elapsed = state.clock.elapsedTime;

    let target = hovered.current ? 1 : 0;

    if (!target && mobile && !reducedMotion) {
      target = (Math.sin(elapsed * 0.6) * 0.5 + 0.5) * 0.55;
    }

    openAmount.current = THREE.MathUtils.damp(
      openAmount.current,
      target,
      6,
      delta,
    );

    const open = openAmount.current;

    if (leftDoor.current) leftDoor.current.rotation.y = -open * 1.18;
    if (rightDoor.current) rightDoor.current.rotation.y = open * 1.18;

    if (lockRing.current) {
      lockRing.current.emissiveIntensity = THREE.MathUtils.lerp(1.5, 4.8, open);
    }
    if (lockBars.current) {
      lockBars.current.emissiveIntensity = THREE.MathUtils.lerp(1.1, 3.6, open);
    }
    if (innerGlow.current) {
      innerGlow.current.intensity = THREE.MathUtils.lerp(2.4, 11, open);
    }

    if (root.current) {
      const sway = reducedMotion
        ? -0.35
        : -0.4 + Math.sin(elapsed * 0.32) * 0.42;
      const pointerX = reducedMotion ? 0 : state.pointer.x * 0.18;
      const pointerY = reducedMotion ? 0 : state.pointer.y * 0.1;

      root.current.rotation.y = THREE.MathUtils.lerp(
        root.current.rotation.y,
        sway + pointerX,
        0.03,
      );
      root.current.rotation.x = THREE.MathUtils.lerp(
        root.current.rotation.x,
        -0.06 + pointerY,
        0.03,
      );
    }
  });

  return (
    <group scale={mobile ? 1.05 : 1.32}>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 6, 6]}
        intensity={2.2}
        color="#e6fff2"
      />
      <pointLight
        position={[-4.5, -2, 3.5]}
        intensity={9}
        distance={14}
        color="#22d3ee"
      />
      <pointLight
        position={[4.5, 3.5, -2.5]}
        intensity={12}
        distance={16}
        color="#1bd96a"
      />

      <Float
        speed={reducedMotion ? 0 : 1.15}
        rotationIntensity={reducedMotion ? 0 : 0.12}
        floatIntensity={reducedMotion ? 0 : 0.35}
      >
        <group ref={root} rotation={[-0.06, -0.35, 0]}>
          <RoundedBox
            args={[2.7, 2.7, 2.2]}
            radius={0.16}
            smoothness={5}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color="#0a1214"
              metalness={0.88}
              roughness={0.28}
              emissive="#062e1b"
              emissiveIntensity={0.35}
            />
            <Edges color="#1bd96a" threshold={22} />
          </RoundedBox>

          <mesh position={[0, 0, 1.13]}>
            <boxGeometry args={[2.48, 2.48, 0.08]} />
            <meshStandardMaterial
              color="#0b181b"
              metalness={0.7}
              roughness={0.34}
            />
            <Edges color="#0f9d58" threshold={22} />
          </mesh>

          <mesh position={[0, 1.42, 1.17]}>
            <boxGeometry args={[1.7, 0.055, 0.055]} />
            <meshStandardMaterial
              color="#1bd96a"
              emissive="#1bd96a"
              emissiveIntensity={2.6}
              toneMapped={false}
            />
          </mesh>

          <group ref={leftDoor} position={[-1.02, 0, 1.19]}>
            <mesh position={[0.51, 0, 0]} castShadow>
              <boxGeometry args={[1.02, 2.2, 0.1]} />
              <meshStandardMaterial
                color="#0b1618"
                metalness={0.92}
                roughness={0.3}
                emissive="#0b3a24"
                emissiveIntensity={0.5}
              />
              <Edges color="#22d3ee" threshold={20} />
            </mesh>
            <mesh position={[0.51, 0.62, 0.07]}>
              <boxGeometry args={[0.58, 0.045, 0.025]} />
              <meshStandardMaterial
                color="#22d3ee"
                emissive="#22d3ee"
                emissiveIntensity={2}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0.52, -0.72, 0.07]}>
              <boxGeometry args={[0.34, 0.14, 0.025]} />
              <meshStandardMaterial
                color="#7dffc4"
                emissive="#7dffc4"
                emissiveIntensity={1.3}
                toneMapped={false}
              />
            </mesh>
          </group>

          <group ref={rightDoor} position={[1.02, 0, 1.19]}>
            <mesh position={[-0.51, 0, 0]} castShadow>
              <boxGeometry args={[1.02, 2.2, 0.1]} />
              <meshStandardMaterial
                color="#0b1618"
                metalness={0.92}
                roughness={0.3}
                emissive="#0b3a24"
                emissiveIntensity={0.5}
              />
              <Edges color="#22d3ee" threshold={20} />
            </mesh>
            <mesh position={[-0.51, 0.62, 0.07]}>
              <boxGeometry args={[0.58, 0.045, 0.025]} />
              <meshStandardMaterial
                color="#22d3ee"
                emissive="#22d3ee"
                emissiveIntensity={2}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[-0.52, -0.72, 0.07]}>
              <boxGeometry args={[0.34, 0.14, 0.025]} />
              <meshStandardMaterial
                color="#7dffc4"
                emissive="#7dffc4"
                emissiveIntensity={1.3}
                toneMapped={false}
              />
            </mesh>
          </group>

          <mesh position={[0, 0, 1.3]}>
            <torusGeometry args={[0.35, 0.05, 18, 72]} />
            <meshStandardMaterial
              ref={lockRing}
              color="#1bd96a"
              emissive="#1bd96a"
              emissiveIntensity={1.5}
              metalness={0.4}
              roughness={0.2}
              toneMapped={false}
            />
          </mesh>

          <mesh position={[0, 0, 1.31]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.055, 0.88, 0.02]} />
            <meshStandardMaterial
              ref={lockBars}
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={1.1}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0, 1.31]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.055, 0.88, 0.02]} />
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={1.1}
              toneMapped={false}
            />
          </mesh>

          {BOLTS.map(([x, y]) => (
            <mesh
              key={`${x}-${y}`}
              position={[x, y, 1.19]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.065, 0.065, 0.06, 16]} />
              <meshStandardMaterial
                color="#1bd96a"
                emissive="#1bd96a"
                emissiveIntensity={1.2}
                toneMapped={false}
              />
            </mesh>
          ))}

          <pointLight
            ref={innerGlow}
            position={[0, 0, 1.7]}
            intensity={2.4}
            distance={7}
            color="#7dffc4"
          />

          <Sparkles
            count={mobile ? 18 : 42}
            scale={[4.2, 4.2, 4.2]}
            size={2.2}
            speed={reducedMotion ? 0 : 0.35}
            color="#7dffc4"
          />

          <mesh
            position={[0, 0, 0]}
            onPointerOver={(event) => {
              event.stopPropagation();
              hovered.current = true;
            }}
            onPointerOut={() => {
              hovered.current = false;
            }}
          >
            <boxGeometry args={[3.6, 3.6, 3.2]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

export function VaultScene() {
  const mobile = useIsMobile();

  return (
    <div
      className="relative h-[320px] w-full select-none sm:h-[420px] lg:h-[500px]"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-x-6 top-1/2 h-40 -translate-y-1/2 rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-16 bottom-4 h-16 rounded-full bg-neon-cyan/10 blur-2xl" />

      <div className="vault-stage h-full w-full">
        <Canvas
          dpr={[1, mobile ? 1.3 : 1.8]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0.15, 6.8], fov: 42 }}
          style={{ touchAction: "pan-y" }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <Vault mobile={mobile} />
        </Canvas>
      </div>
    </div>
  );
}
