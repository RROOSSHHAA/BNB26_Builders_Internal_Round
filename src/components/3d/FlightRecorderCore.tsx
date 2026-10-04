"use client";

import * as React from "react";
import * as THREE from "three";

interface FlightRecorderCoreProps {
  status?: "healthy" | "anomaly" | "analyzing";
  interactive?: boolean;
  className?: string;
}

export function FlightRecorderCore({
  status = "anomaly",
  interactive = true,
  className,
}: FlightRecorderCoreProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL not supported or context error", e);
      return;
    }

    // Colors
    const isAnomaly = status === "anomaly";
    const accentColor = isAnomaly ? 0xef4444 : 0x06b6d4; // Red for anomaly, Cyan for nominal
    const coreColor = 0x0f172a;
    const ringColor = isAnomaly ? 0xf59e0b : 0x38bdf8;

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central "Flight Recorder" Core Monolith (Chamber)
    const coreGeometry = new THREE.CylinderGeometry(1.2, 1.2, 2.8, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: coreColor,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    rootGroup.add(coreMesh);

    // Core Wireframe Ribs
    const wireGeo = new THREE.CylinderGeometry(1.22, 1.22, 2.82, 16, 4);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x334155,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    rootGroup.add(wireMesh);

    // 2. Anomaly Core Heart (Internal Glowing Seed)
    const heartGeo = new THREE.IcosahedronGeometry(0.65, 2);
    const heartMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    rootGroup.add(heartMesh);

    // 3. Orbital Telemetry Rings (Telemetry Channels)
    const createRing = (radius: number, tube: number, color: number, rotX: number, rotY: number) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.25,
        roughness: 0.3,
        metalness: 0.7,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = rotX;
      ring.rotation.y = rotY;
      return ring;
    };

    const ring1 = createRing(2.2, 0.02, ringColor, Math.PI / 3, 0.2);
    const ring2 = createRing(2.6, 0.015, 0x64748b, -Math.PI / 4, 0.5);
    const ring3 = createRing(3.0, 0.018, accentColor, Math.PI / 6, -0.4);

    rootGroup.add(ring1);
    rootGroup.add(ring2);
    rootGroup.add(ring3);

    // 4. Data Trace Particles (Compressed Ingestion Stream)
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2.0 + (i % 3) * 0.5 + (Math.random() - 0.5) * 0.4;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: accentColor,
      size: 0.04,
      transparent: true,
      opacity: 0.75,
    });
    const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
    rootGroup.add(particlePoints);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(accentColor, 2.5, 12);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Interaction mouse drag
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      rootGroup.rotation.y += deltaX * 0.006;
      rootGroup.rotation.x += deltaY * 0.006;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    if (interactive) {
      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Idle smooth rotation
      rootGroup.rotation.y += 0.004;
      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.005;
      ring3.rotation.z += 0.006;

      // Anomaly pulsing rhythm
      const pulse = 1 + Math.sin(elapsed * (isAnomaly ? 5 : 2)) * 0.08;
      heartMesh.scale.set(pulse, pulse, pulse);

      particlePoints.rotation.y -= 0.003;

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0 && renderer) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      }
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [status, interactive]);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="w-full h-full min-h-[340px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      />
    </div>
  );
}
