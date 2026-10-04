"use client";

import * as React from "react";
import * as THREE from "three";

interface ExecutionMapProps {
  className?: string;
}

export function ExecutionIntelligenceMap({ className }: ExecutionMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(4, 5, 8);
    camera.lookAt(0, 0, 0);

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
      console.warn("WebGL not supported", e);
      return;
    }

    const group = new THREE.Group();
    scene.add(group);

    // 4 Layered Execution Region Strata
    const strata = [
      { name: "Retrieval", color: 0x10b981, y: 1.2, height: 0.15, width: 2.8, depth: 1.8 },
      { name: "Reasoning", color: 0x06b6d4, y: 0.4, height: 0.25, width: 3.2, depth: 2.0 },
      { name: "Anomaly Region", color: 0xef4444, y: -0.5, height: 0.45, width: 2.5, depth: 1.6 },
      { name: "Finalization", color: 0x818cf8, y: -1.3, height: 0.2, width: 3.0, depth: 1.9 },
    ];

    strata.forEach((stratum) => {
      const geo = new THREE.BoxGeometry(stratum.width, stratum.height, stratum.depth);
      const mat = new THREE.MeshStandardMaterial({
        color: stratum.color,
        roughness: 0.3,
        metalness: 0.5,
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = stratum.y;
      group.add(mesh);

      // Edge wire
      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
      const edgeMesh = new THREE.LineSegments(edgeGeo, edgeMat);
      edgeMesh.position.y = stratum.y;
      group.add(edgeMesh);
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      group.rotation.y += 0.005;
      if (renderer) renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && renderer) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full h-full min-h-[340px] flex items-center justify-center" />
    </div>
  );
}
