"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, RoundedBox, Sparkles } from "@react-three/drei";
import { useReducedMotion, useSpring } from "motion/react";
import * as THREE from "three";
import { useIsMobile } from "@/lib/useMediaQuery";

interface SpringValue {
  get: () => number;
  set: (value: number) => void;
}

const springConfig = { stiffness: 160, damping: 20, mass: 0.7 };

const portalVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const portalFragment = /* glsl */ `
  uniform float uTime;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float a = atan(p.y, p.x);

    float swirl = sin(a * 3.0 + r * 11.0 - uTime * 1.7);
    float bands = smoothstep(-0.1, 0.9, swirl * 0.5 + 0.5);
    float core = smoothstep(1.0, 0.0, r);
    float edge = smoothstep(0.07, 0.0, abs(r - 0.82));
    float spokes = smoothstep(0.82, 0.96, sin(a * 8.0 + uTime * 0.8) * 0.5 + 0.5);

    float alpha = core * (0.32 + bands * 0.38) + edge * 0.35 + spokes * core * 0.16;
    vec3 color = mix(vec3(0.45, 0.13, 0.045), vec3(1.0, 0.45, 0.12), bands);
    color += vec3(0.35, 0.09, 0.02) * uHover;

    gl_FragColor = vec4(color, alpha * (0.7 + uHover * 0.45));
  }
`;

function Tower({
  mobile,
  pointerX,
  pointerY,
  hover,
}: {
  mobile: boolean;
  pointerX: SpringValue;
  pointerY: SpringValue;
  hover: SpringValue;
}) {
  const tower = useRef<THREE.Group>(null);
  const coreLight = useRef<THREE.PointLight>(null);
  const coreMaterial = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const h = hover.get();
    const px = pointerX.get();
    const py = pointerY.get();

    if (tower.current) {
      tower.current.rotation.x = THREE.MathUtils.damp(
        tower.current.rotation.x,
        -0.04 - py * 0.22,
        7,
        delta,
      );
      tower.current.rotation.y = THREE.MathUtils.damp(
        tower.current.rotation.y,
        px * 0.36,
        7,
        delta,
      );
      tower.current.rotation.z = THREE.MathUtils.damp(
        tower.current.rotation.z,
        px * -0.035,
        7,
        delta,
      );
    }

    if (coreLight.current) {
      coreLight.current.intensity = THREE.MathUtils.damp(
        coreLight.current.intensity,
        4 + h * 5,
        5,
        delta,
      );
    }

    if (coreMaterial.current) {
      coreMaterial.current.emissiveIntensity = THREE.MathUtils.damp(
        coreMaterial.current.emissiveIntensity,
        2.2 + h * 1.6,
        5,
        delta,
      );
    }
  });

  return (
    <group position={[0, -0.95, 0]} scale={mobile ? 0.86 : 0.95}>
      <group ref={tower} rotation={[-0.04, 0, 0]}>
        <RoundedBox
          args={[1.6, 2.25, 1.5]}
          radius={0.07}
          smoothness={3}
          castShadow={false}
          receiveShadow={false}
        >
          <meshStandardMaterial
            color="#0b0908"
            metalness={0.88}
            roughness={0.3}
            emissive="#1b0a04"
            emissiveIntensity={0.4}
          />
          <Edges color="#7c2d12" threshold={28} />
        </RoundedBox>

        <mesh position={[0, 0, 0.76]}>
          <boxGeometry args={[1.38, 1.92, 0.035]} />
          <meshPhysicalMaterial
            color="#341309"
            metalness={0.45}
            roughness={0.08}
            transparent
            opacity={0.22}
            depthWrite={false}
          />
          <Edges color="#bf4417" threshold={25} />
        </mesh>

        <mesh position={[-0.78, 0, 0]}>
          <boxGeometry args={[0.02, 1.72, 1.16]} />
          <meshPhysicalMaterial
            color="#2a1008"
            metalness={0.4}
            roughness={0.1}
            transparent
            opacity={0.18}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0.78, 0, 0]}>
          <boxGeometry args={[0.02, 1.72, 1.16]} />
          <meshPhysicalMaterial
            color="#2a1008"
            metalness={0.4}
            roughness={0.1}
            transparent
            opacity={0.18}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0, 0.1, 0.72]}>
          <boxGeometry args={[0.075, 1.34, 0.055]} />
          <meshStandardMaterial
            ref={coreMaterial}
            color="#f97316"
            emissive="#f97316"
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>

        <mesh position={[0.46, 0.28, 0.7]}>
          <boxGeometry args={[0.46, 0.06, 0.05]} />
          <meshStandardMaterial
            color="#d97706"
            emissive="#d97706"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0.46, 0.12, 0.7]}>
          <boxGeometry args={[0.46, 0.06, 0.05]} />
          <meshStandardMaterial
            color="#bf4417"
            emissive="#bf4417"
            emissiveIntensity={1.1}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0.46, -0.04, 0.7]}>
          <boxGeometry args={[0.3, 0.06, 0.05]} />
          <meshStandardMaterial
            color="#7c2d12"
            emissive="#7c2d12"
            emissiveIntensity={0.9}
            toneMapped={false}
          />
        </mesh>

        <group position={[0, 0.52, 0.78]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.27, 0.022, 8, mobile ? 24 : 36]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#f97316"
              emissiveIntensity={2.1}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0, -0.045]}>
            <cylinderGeometry args={[0.25, 0.25, 0.035, mobile ? 18 : 28]} />
            <meshStandardMaterial
              color="#120a07"
              metalness={0.8}
              roughness={0.35}
            />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              position={[0, 0, 0.015]}
              rotation={[Math.PI / 2, 0, (i * Math.PI) / 2]}
            >
              <boxGeometry args={[0.055, 0.39, 0.012]} />
              <meshStandardMaterial
                color="#3a1b10"
                metalness={0.8}
                roughness={0.3}
                emissive="#7c2d12"
                emissiveIntensity={0.35}
              />
            </mesh>
          ))}
        </group>

        {[-0.42, -0.2, 0.02, 0.24].map((y) => (
          <mesh key={y} position={[-0.36, y, 0.78]}>
            <boxGeometry args={[0.62, 0.024, 0.012]} />
            <meshStandardMaterial
              color="#4a2012"
              metalness={0.8}
              roughness={0.35}
              emissive="#bf4417"
              emissiveIntensity={0.25}
            />
          </mesh>
        ))}

        <mesh position={[0, 1.16, 0]}>
          <boxGeometry args={[1.42, 0.06, 1.24]} />
          <meshStandardMaterial
            color="#17100c"
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 1.2, 0.38]}>
          <boxGeometry args={[1.08, 0.015, 0.06]} />
          <meshStandardMaterial
            color="#f97316"
            emissive="#f97316"
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>

        <RoundedBox
          args={[1.92, 0.13, 1.78]}
          radius={0.04}
          smoothness={2}
          position={[0, -1.19, 0]}
        >
          <meshStandardMaterial
            color="#0a0807"
            metalness={0.9}
            roughness={0.3}
          />
          <Edges color="#7c2d12" threshold={30} />
        </RoundedBox>

        <mesh position={[0, -1.11, 0.69]}>
          <boxGeometry args={[1.22, 0.015, 0.05]} />
          <meshStandardMaterial
            color="#bf4417"
            emissive="#bf4417"
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>

        <pointLight
          ref={coreLight}
          position={[0, -0.15, 1.05]}
          intensity={4}
          distance={4.5}
          color="#f97316"
        />
      </group>
    </group>
  );
}

function Portal({
  mobile,
  hover,
  reducedMotion,
}: {
  mobile: boolean;
  hover: SpringValue;
  reducedMotion: boolean;
}) {
  const portal = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const ringMaterials = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const discMaterial = useRef<THREE.ShaderMaterial>(null);
  const portalLight = useRef<THREE.PointLight>(null);
  const orbitA = useRef<THREE.Mesh>(null);
  const orbitB = useRef<THREE.Mesh>(null);
  const spin = useRef(0);
  const speed = useRef(0.32);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
    }),
    [],
  );

  const ringConfig = useMemo(
    () => [
      { radius: 0.54, tube: 0.018, color: "#fbbf24", opacity: 0.95 },
      { radius: 0.8, tube: 0.016, color: "#f97316", opacity: 0.8 },
      { radius: 1.05, tube: 0.02, color: "#bf4417", opacity: 0.6 },
      { radius: 1.3, tube: 0.012, color: "#7c2d12", opacity: 0.45 },
    ],
    [],
  );

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const h = hover.get();
    const elapsed = state.clock.elapsedTime;

    speed.current = THREE.MathUtils.damp(
      speed.current,
      0.32 + h * 1.75,
      3.5,
      delta,
    );

    if (!reducedMotion) {
      spin.current += speed.current * delta;
    }

    if (portal.current) {
      portal.current.rotation.z = reducedMotion
        ? 0.35
        : spin.current + Math.sin(elapsed * 0.35) * 0.05;
      const scale = 1 + h * 0.17 + Math.sin(elapsed * 1.4) * 0.008;
      portal.current.scale.setScalar(scale);
      portal.current.position.y = 1.88 + (reducedMotion ? 0 : Math.sin(elapsed * 0.9) * 0.035);
    }

    rings.current.forEach((ring, index) => {
      if (!ring) return;
      const direction = index % 2 === 0 ? 1 : -1;
      if (!reducedMotion) {
        ring.rotation.z += direction * (0.09 + h * 0.65) * delta;
      }
      ring.rotation.x = Math.sin(elapsed * 0.3 + index) * 0.04;
      ring.rotation.y = Math.cos(elapsed * 0.25 + index) * 0.04;
      const material = ringMaterials.current[index];
      if (material) {
        material.opacity = THREE.MathUtils.damp(
          material.opacity,
          ringConfig[index].opacity * (1 + h * 0.25),
          4,
          delta,
        );
      }
    });

    if (discMaterial.current) {
      discMaterial.current.uniforms.uTime.value = reducedMotion ? 1.4 : elapsed;
      discMaterial.current.uniforms.uHover.value = THREE.MathUtils.damp(
        discMaterial.current.uniforms.uHover.value,
        h,
        4,
        delta,
      );
    }

    if (portalLight.current) {
      portalLight.current.intensity = THREE.MathUtils.damp(
        portalLight.current.intensity,
        5 + h * 10,
        4,
        delta,
      );
    }

    const orbitSpeed = reducedMotion ? 0 : 0.7 + h * 1.2;
    if (orbitA.current) {
      orbitA.current.position.set(
        Math.cos(elapsed * orbitSpeed) * 1.13,
        Math.sin(elapsed * orbitSpeed) * 1.13,
        0.16,
      );
    }
    if (orbitB.current) {
      orbitB.current.position.set(
        Math.cos(elapsed * orbitSpeed + Math.PI) * 1.22,
        Math.sin(elapsed * orbitSpeed + Math.PI) * 1.22,
        0.12,
      );
    }
  });

  return (
    <group ref={portal} position={[0, 1.88, 0.25]} rotation={[0, 0, 0.35]}>
      <mesh position={[0, 0, -0.12]}>
        <circleGeometry args={[1.55, mobile ? 36 : 64]} />
        <meshBasicMaterial
          color="#bf4417"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, -0.06]}>
        <circleGeometry args={[1.16, mobile ? 36 : 64]} />
        <shaderMaterial
          ref={discMaterial}
          vertexShader={portalVertex}
          fragmentShader={portalFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {ringConfig.map((ring, index) => (
        <mesh
          key={ring.radius}
          ref={(element) => {
            rings.current[index] = element;
          }}
          position={[0, 0, index * 0.015]}
          rotation={[0, 0, index * 0.55]}
        >
          <torusGeometry
            args={[
              ring.radius,
              ring.tube,
              8,
              mobile ? 32 : 56,
            ]}
          />
          <meshBasicMaterial
            ref={(material) => {
              ringMaterials.current[index] = material;
            }}
            color={ring.color}
            transparent
            opacity={ring.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      <mesh ref={orbitA}>
        <icosahedronGeometry args={[0.045, 0]} />
        <meshBasicMaterial
          color="#fbbf24"
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={orbitB}>
        <icosahedronGeometry args={[0.035, 0]} />
        <meshBasicMaterial
          color="#f97316"
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <Sparkles
        count={mobile ? 16 : 38}
        scale={[3.1, 3.1, 0.7]}
        size={mobile ? 1.6 : 2.2}
        speed={reducedMotion ? 0 : 0.35}
        opacity={0.6}
        color="#f59e0b"
      />

      <pointLight
        ref={portalLight}
        position={[0, 0, 0.9]}
        intensity={5}
        distance={5.5}
        color="#f97316"
      />
    </group>
  );
}

function Showcase({
  mobile,
  pointerX,
  pointerY,
  hover,
  reducedMotion,
}: {
  mobile: boolean;
  pointerX: SpringValue;
  pointerY: SpringValue;
  hover: SpringValue;
  reducedMotion: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.55} color="#ffe9db" />
      <directionalLight position={[4, 6, 5]} intensity={1.65} color="#fff4ea" />
      <pointLight
        position={[-3.5, 1.2, 3]}
        intensity={5}
        distance={9}
        color="#f97316"
      />
      <pointLight
        position={[3.2, 2.8, -2]}
        intensity={4}
        distance={8}
        color="#bf4417"
      />
      <Tower
        mobile={mobile}
        pointerX={pointerX}
        pointerY={pointerY}
        hover={hover}
      />
      <Portal mobile={mobile} hover={hover} reducedMotion={reducedMotion} />
    </>
  );
}

export function ShowcaseScene() {
  const mobile = useIsMobile();
  const reducedMotion = useReducedMotion() ?? false;
  const wrapper = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const pointerX = useSpring(0, springConfig);
  const pointerY = useSpring(0, springConfig);
  const hover = useSpring(0, { stiffness: 190, damping: 22, mass: 0.6 });

  useEffect(() => {
    const node = wrapper.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(node);

    const onVisibility = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function handlePointerEnter(event: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType === "touch") return;
    hover.set(1);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
    hover.set(0);
  }

  return (
    <div
      ref={wrapper}
      className="relative h-[330px] w-full select-none sm:h-[430px] lg:h-[520px]"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      <div className="pointer-events-none absolute inset-x-8 top-6 h-48 rounded-full bg-brand/10 blur-[90px]" />

      <div className="vault-stage h-full w-full">
        <Canvas
          dpr={[1, mobile ? 1.2 : 1.6]}
          gl={{
            antialias: !mobile,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0.55, 7.2], fov: 40 }}
          frameloop={active ? "always" : "never"}
          style={{ touchAction: "pan-y" }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <Showcase
            mobile={mobile}
            pointerX={pointerX}
            pointerY={pointerY}
            hover={hover}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      </div>
    </div>
  );
}
