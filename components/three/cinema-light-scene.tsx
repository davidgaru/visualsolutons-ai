"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh, Points } from "three";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  MathUtils
} from "three";

function DustField() {
  const pointsRef = useRef<Points>(null);

  const geometry = useMemo(() => {
    const count = 2200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 20;
      positions[idx + 1] = (Math.random() - 0.5) * 10;
      positions[idx + 2] = (Math.random() - 0.5) * 14;
    }

    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.006;
    pointsRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
    pointsRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.11) * 0.06;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#f2e5cb"
        size={0.014}
        sizeAttenuation
        transparent
        opacity={0.14}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

function ProjectorRig() {
  const beamPrimaryRef = useRef<Mesh>(null);
  const beamSecondaryRef = useRef<Mesh>(null);
  const lensRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (beamPrimaryRef.current) {
      beamPrimaryRef.current.rotation.z = Math.sin(t * 0.26) * 0.03;
      beamPrimaryRef.current.position.y = Math.sin(t * 0.18) * 0.06;
      const material = beamPrimaryRef.current.material as { opacity?: number };
      material.opacity = 0.065 + Math.sin(t * 2.4) * 0.008;
    }

    if (beamSecondaryRef.current) {
      beamSecondaryRef.current.rotation.z = Math.sin(t * 0.31) * 0.038;
      beamSecondaryRef.current.position.y = Math.sin(t * 0.2 + 1) * 0.05;
      const material = beamSecondaryRef.current.material as { opacity?: number };
      material.opacity = 0.082 + Math.sin(t * 1.7) * 0.011;
    }

    if (lensRef.current) {
      lensRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.06);
      const material = lensRef.current.material as { opacity?: number; color?: Color };
      material.opacity = 0.42 + Math.sin(t * 2) * 0.05;
      if (material.color) {
        material.color.setHSL(0, 0, 0.95 + Math.sin(t * 1.8) * 0.03);
      }
    }
  });

  return (
    <group position={[5.2, 0.1, -3.5]}>
      <mesh ref={beamPrimaryRef} rotation={[0, Math.PI / 2, 0]}>
        <coneGeometry args={[7, 18, 56, 1, true]} />
        <meshBasicMaterial
          color="#f4e4c2"
          transparent
          opacity={0.052}
          side={DoubleSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={beamSecondaryRef} rotation={[0, Math.PI / 2, 0]} position={[-0.25, 0.04, -0.2]}>
        <coneGeometry args={[4, 14, 44, 1, true]} />
        <meshBasicMaterial
          color="#e8c88d"
          transparent
          opacity={0.075}
          side={DoubleSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={lensRef} position={[0.1, 0.04, 0]}>
        <sphereGeometry args={[0.46, 24, 24]} />
        <meshBasicMaterial color="#f1dfb8" transparent opacity={0.44} blending={AdditiveBlending} />
      </mesh>

      <mesh rotation={[0, Math.PI / 2, 0]} position={[-2.2, 0.05, -5.1]}>
        <planeGeometry args={[5.5, 3.9]} />
        <meshBasicMaterial color="#efddb7" transparent opacity={0.025} blending={AdditiveBlending} />
      </mesh>
    </group>
  );
}

function VignettePlates() {
  const leftRef = useRef<Mesh>(null);
  const rightRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (leftRef.current) {
      leftRef.current.position.x = MathUtils.lerp(leftRef.current.position.x, -8 + Math.sin(t * 0.1) * 0.08, 0.04);
    }

    if (rightRef.current) {
      rightRef.current.position.x = MathUtils.lerp(rightRef.current.position.x, 8 + Math.cos(t * 0.1) * 0.08, 0.04);
    }
  });

  return (
    <>
      <mesh ref={leftRef} position={[-8, 0, 0]}>
        <planeGeometry args={[4, 14]} />
        <meshBasicMaterial color="#090806" transparent opacity={0.65} />
      </mesh>
      <mesh ref={rightRef} position={[8, 0, 0]}>
        <planeGeometry args={[4, 14]} />
        <meshBasicMaterial color="#090806" transparent opacity={0.65} />
      </mesh>
    </>
  );
}

export function CinemaLightScene() {
  return (
    <div className="cinema-light-scene" aria-hidden>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#070604"]} />
        <fog attach="fog" args={["#070604", 4, 16]} />
        <ambientLight intensity={0.16} />
        <ProjectorRig />
        <DustField />
        <VignettePlates />
      </Canvas>
    </div>
  );
}
