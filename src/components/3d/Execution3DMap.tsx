"use client";

import * as React from "react";
import * as THREE from "three";
import { Execution, ExecutionRegion } from "@/types";
import { cn, formatDuration } from "@/lib/utils";
import {
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  SearchAlert,
  Sliders,
  Eye,
  Maximize2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Execution3DMapProps {
  execution: Execution;
  selectedRegionId?: string | null;
  onSelectRegion?: (region: ExecutionRegion) => void;
  onInvestigateAnomaly?: () => void;
  className?: string;
  height?: number | string;
}

export function Execution3DMap({
  execution,
  selectedRegionId,
  onSelectRegion,
  onInvestigateAnomaly,
  className,
  height = 360,
}: Execution3DMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);

  // Hover state for interactive HUD
  const [hoveredRegion, setHoveredRegion] = React.useState<ExecutionRegion | null>(null);
  const [hudPosition, setHudPosition] = React.useState<{ x: number; y: number } | null>(null);
  const [isRotating, setIsRotating] = React.useState(true);
  const [viewAngle, setViewAngle] = React.useState<"isometric" | "top" | "side">("isometric");

  // Reference for 3D state & disposal
  const stateRef = React.useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    rootGroup: THREE.Group;
    nodesGroup: THREE.Group;
    pulseMesh: THREE.Mesh;
    curve: THREE.CatmullRomCurve3;
    nodeMeshes: { mesh: THREE.Mesh; region: ExecutionRegion; baseScale: number }[];
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    animId: number;
    isDragging: boolean;
    prevMouse: { x: number; y: number };
    targetRot: { x: number; y: number };
    currRot: { x: number; y: number };
    prefersReducedMotion: boolean;
  } | null>(null);

  React.useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = container.clientWidth || 600;
    const heightPx = typeof height === "number" ? height : container.clientHeight || 360;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / heightPx, 0.1, 100);
    camera.position.set(0, 3.2, 10.5);
    camera.lookAt(0, -0.2, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, heightPx);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.innerHTML = "";
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL initialization failed", e);
      return;
    }

    // 2. Lighting (Controlled, Technical Dark Aesthetic)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight1.position.set(5, 8, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xef4444, 0.8);
    dirLight2.position.set(-4, -2, -3);
    scene.add(dirLight2);

    // 3. Root Group with interactive rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Subtle isometric reference grid floor
    const gridHelper = new THREE.GridHelper(14, 14, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -1.6;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    rootGroup.add(gridHelper);

    // 4. Map Regions to 3D Coordinates
    const regions = execution.regions;
    const nodeCoords: THREE.Vector3[] = [
      new THREE.Vector3(-4.0, 0.4, 0.2), // 1. Retrieval
      new THREE.Vector3(-1.3, 0.1, -0.1), // 2. Reasoning
      new THREE.Vector3(1.3, -0.2, 0.3), // 3. Anomaly
      new THREE.Vector3(4.0, -0.5, -0.2), // 4. Finalization
    ];

    // Spline trajectory curve
    const curve = new THREE.CatmullRomCurve3(nodeCoords);
    const curvePoints = curve.getPoints(80);
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const pathMaterial = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.45,
      linewidth: 2,
    });
    const pathLine = new THREE.Line(pathGeometry, pathMaterial);
    rootGroup.add(pathLine);

    // 5. Data Flow Pulse along the curve (stops at Anomaly)
    const pulseGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    pulseMesh.position.copy(nodeCoords[0]);
    rootGroup.add(pulseMesh);

    // 6. Interactive Region Nodes
    const nodesGroup = new THREE.Group();
    rootGroup.add(nodesGroup);

    const nodeMeshes: { mesh: THREE.Mesh; region: ExecutionRegion; baseScale: number }[] = [];

    regions.forEach((region, idx) => {
      const pos = nodeCoords[idx] || new THREE.Vector3(idx * 2 - 3, 0, 0);
      const isAnomaly = region.isAnomaly || region.status === "critical";
      const isAffected = region.status === "affected" || region.status === "warning";

      let geo: THREE.BufferGeometry;
      let mat: THREE.MeshStandardMaterial;
      const baseScale = isAnomaly ? 1.25 : 1.0;

      if (isAnomaly) {
        // Octahedron faceted jewel for Anomaly Region
        geo = new THREE.OctahedronGeometry(0.55, 0);
        mat = new THREE.MeshStandardMaterial({
          color: 0xef4444,
          emissive: 0xb91c1c,
          emissiveIntensity: 0.4,
          roughness: 0.25,
          metalness: 0.8,
          wireframe: false,
        });
      } else if (isAffected) {
        // Truncated cylinder for Affected
        geo = new THREE.CylinderGeometry(0.42, 0.48, 0.65, 6);
        mat = new THREE.MeshStandardMaterial({
          color: 0x64748b,
          emissive: 0x334155,
          emissiveIntensity: 0.2,
          roughness: 0.4,
          metalness: 0.6,
        });
      } else if (idx === 0) {
        // Hexagonal prism for Data Retrieval
        geo = new THREE.CylinderGeometry(0.45, 0.45, 0.6, 6);
        mat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 0.25,
          roughness: 0.3,
          metalness: 0.7,
        });
      } else {
        // Rounded box for Numerical Reasoning
        geo = new THREE.BoxGeometry(0.75, 0.65, 0.75);
        mat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          emissive: 0x0284c7,
          emissiveIntensity: 0.3,
          roughness: 0.3,
          metalness: 0.7,
        });
      }

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      mesh.scale.setScalar(baseScale);
      mesh.userData = { region, index: idx };
      nodesGroup.add(mesh);

      // Edge outline
      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: isAnomaly ? 0xfca5a5 : 0xffffff,
        transparent: true,
        opacity: isAnomaly ? 0.8 : 0.35,
      });
      const edgeMesh = new THREE.LineSegments(edgeGeo, edgeMat);
      mesh.add(edgeMesh);

      // Floating halo for Anomaly
      if (isAnomaly) {
        const ringGeo = new THREE.TorusGeometry(0.85, 0.025, 8, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.7,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.name = "anomalyRing";
        mesh.add(ringMesh);
      }

      // Vertical pedestal beam to grid floor
      const beamGeo = new THREE.CylinderGeometry(0.015, 0.015, Math.abs(pos.y - (-1.6)), 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: isAnomaly ? 0xef4444 : 0x334155,
        transparent: true,
        opacity: 0.35,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(pos.x, -1.6 + Math.abs(pos.y - (-1.6)) / 2, pos.z);
      rootGroup.add(beamMesh);

      nodeMeshes.push({ mesh, region, baseScale });
    });

    // 7. Raycasting & Mouse Interaction Setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    stateRef.current = {
      scene,
      camera,
      renderer,
      rootGroup,
      nodesGroup,
      pulseMesh,
      curve,
      nodeMeshes,
      raycaster,
      mouse,
      animId: 0,
      isDragging: false,
      prevMouse: { x: 0, y: 0 },
      targetRot: { x: 0.15, y: -0.1 },
      currRot: { x: 0.15, y: -0.1 },
      prefersReducedMotion,
    };

    // 8. Animation Loop
    let pulseT = 0;
    const animate = () => {
      stateRef.current!.animId = requestAnimationFrame(animate);

      // Pulse traveling data packet (from Retrieval up to Anomaly Step 73, then looping)
      if (!prefersReducedMotion && isRotating) {
        pulseT = (pulseT + 0.006) % 0.72; // Caps at 72% where the anomaly diverges!
        const pt = curve.getPointAt(pulseT);
        pulseMesh.position.copy(pt);
      }

      // Anomaly ring subtle rotation
      const anomalyMesh = nodeMeshes.find((nm) => nm.region.isAnomaly)?.mesh;
      if (anomalyMesh) {
        const ring = anomalyMesh.getObjectByName("anomalyRing");
        if (ring && !prefersReducedMotion) {
          ring.rotation.z += 0.015;
        }
      }

      // Damped interactive camera orbit
      if (!prefersReducedMotion) {
        const s = stateRef.current!;
        s.currRot.x += (s.targetRot.x - s.currRot.x) * 0.08;
        s.currRot.y += (s.targetRot.y - s.currRot.y) * 0.08;
        rootGroup.rotation.x = s.currRot.x;
        rootGroup.rotation.y = s.currRot.y;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      if (stateRef.current) {
        cancelAnimationFrame(stateRef.current.animId);
      }
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [execution, height, isRotating]);

  // Handle Mouse Move for Raycast & Hover Tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const s = stateRef.current;
    if (!s || !canvasContainerRef.current) return;

    const rect = canvasContainerRef.current.getBoundingClientRect();
    s.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    s.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Handle drag rotation
    if (s.isDragging && !s.prefersReducedMotion) {
      const deltaX = e.clientX - s.prevMouse.x;
      const deltaY = e.clientY - s.prevMouse.y;
      s.targetRot.y += deltaX * 0.005;
      s.targetRot.x = Math.max(-0.4, Math.min(0.5, s.targetRot.x + deltaY * 0.005));
      s.prevMouse = { x: e.clientX, y: e.clientY };
    }

    // Raycast intersections
    s.raycaster.setFromCamera(s.mouse, s.camera);
    const intersects = s.raycaster.intersectObjects(
      s.nodeMeshes.map((nm) => nm.mesh),
      false
    );

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const hitData = s.nodeMeshes.find((nm) => nm.mesh === hitMesh);

      if (hitData) {
        setHoveredRegion(hitData.region);
        setHudPosition({
          x: Math.min(rect.width - 240, Math.max(16, e.clientX - rect.left - 100)),
          y: Math.max(16, e.clientY - rect.top - 120),
        });

        // Hover scale highlight
        s.nodeMeshes.forEach((nm) => {
          if (nm.mesh === hitMesh) {
            nm.mesh.scale.setScalar(nm.baseScale * 1.15);
          } else {
            nm.mesh.scale.setScalar(nm.baseScale);
          }
        });
        return;
      }
    }

    // Reset hover if no intersection
    if (hoveredRegion && !s.isDragging) {
      setHoveredRegion(null);
      setHudPosition(null);
      s.nodeMeshes.forEach((nm) => nm.mesh.scale.setScalar(nm.baseScale));
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const s = stateRef.current;
    if (!s) return;
    s.isDragging = true;
    s.prevMouse = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    const s = stateRef.current;
    if (!s) return;
    s.isDragging = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const s = stateRef.current;
    if (!s || !canvasContainerRef.current) return;

    const rect = canvasContainerRef.current.getBoundingClientRect();
    s.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    s.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    s.raycaster.setFromCamera(s.mouse, s.camera);
    const intersects = s.raycaster.intersectObjects(
      s.nodeMeshes.map((nm) => nm.mesh),
      false
    );

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const hitData = s.nodeMeshes.find((nm) => nm.mesh === hitMesh);
      if (hitData) {
        onSelectRegion?.(hitData.region);
        if (hitData.region.isAnomaly) {
          onInvestigateAnomaly?.();
        }
      }
    }
  };

  const handleResetCamera = () => {
    const s = stateRef.current;
    if (!s) return;
    s.targetRot = { x: 0.15, y: -0.1 };
    s.camera.position.set(0, 3.2, 10.5);
    s.camera.lookAt(0, -0.2, 0);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full rounded-2xl border border-white/[0.08] bg-[#070a10] overflow-hidden select-none",
        className
      )}
    >
      {/* 3D Scene Controls Header Strip */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-cyan-500/30 bg-[#090d14]/90 text-[10px] font-mono font-bold text-cyan-300 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>3D EXECUTION INTELLIGENCE</span>
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-zinc-500">
            Interactive Flight Vector
          </span>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={handleResetCamera}
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-white/[0.08] bg-[#090d14]/80 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 hover:border-white/20 transition-colors backdrop-blur-md"
            title="Reset 3D camera angle"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset Angle</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={cn(
              "px-2 py-1 rounded-md border text-[10px] font-mono transition-colors backdrop-blur-md",
              isRotating
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                : "border-white/[0.08] bg-[#090d14]/80 text-zinc-500"
            )}
            title="Toggle data packet motion"
          >
            {isRotating ? "Flow: Active" : "Flow: Paused"}
          </button>
        </div>
      </div>

      {/* WebGL Canvas Container */}
      <div
        ref={canvasContainerRef}
        suppressHydrationWarning
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing"
      />

      {/* Interactive Raycast HUD Overlay Tooltip */}
      {hoveredRegion && hudPosition && (
        <div
          style={{
            transform: `translate3d(${hudPosition.x}px, ${hudPosition.y}px, 0)`,
          }}
          className="absolute top-0 left-0 z-30 pointer-events-none transition-transform duration-75 ease-out"
        >
          <div className="w-56 rounded-xl border border-white/20 bg-[#090d14]/95 p-3 shadow-2xl backdrop-blur-md font-mono space-y-2 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5">
              <span className="text-[11px] font-bold text-white truncate">
                {hoveredRegion.name}
              </span>
              <span
                className={cn(
                  "text-[9px] px-1.5 py-0.2 rounded font-bold uppercase",
                  hoveredRegion.isAnomaly
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : hoveredRegion.status === "warning" || hoveredRegion.status === "affected"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                )}
              >
                {hoveredRegion.isAnomaly ? "Divergence Root" : hoveredRegion.status}
              </span>
            </div>

            <div className="text-[10px] text-zinc-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Steps:</span>
                <span className="font-semibold text-cyan-300">
                  {hoveredRegion.startStep}–{hoveredRegion.endStep} ({hoveredRegion.stepCount})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Duration:</span>
                <span className="text-zinc-300">{formatDuration(hoveredRegion.metrics.latencyMs)}</span>
              </div>
              {hoveredRegion.isAnomaly && (
                <div className="flex justify-between text-red-400 font-bold pt-0.5 border-t border-red-500/20">
                  <span>Likelihood:</span>
                  <span>91% (Step 73)</span>
                </div>
              )}
            </div>

            <div className="pt-1 text-[9px] text-cyan-400 flex items-center justify-between border-t border-white/[0.06]">
              <span>Click node to inspect</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Telemetry Legend & Anomaly Indicator */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none text-xs font-mono">
        <div className="flex items-center gap-3 bg-[#070a10]/85 border border-white/[0.06] px-3 py-1.5 rounded-lg backdrop-blur-md pointer-events-auto">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>01 Retrieval</span>
          </div>
          <span className="text-zinc-600">&bull;</span>
          <div className="flex items-center gap-1.5 text-cyan-400 text-[11px]">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>02 Reasoning</span>
          </div>
          <span className="text-zinc-600">&bull;</span>
          <div className="flex items-center gap-1.5 text-red-400 text-[11px] font-bold">
            <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
            <span>03 Anomaly (Step 73)</span>
          </div>
          <span className="text-zinc-600">&bull;</span>
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <span className="h-2 w-2 rounded-full bg-zinc-500" />
            <span>04 Finalization</span>
          </div>
        </div>

        {/* Anomaly Quick Action CTA */}
        <button
          type="button"
          onClick={() => {
            const anomaly = execution.regions.find((r) => r.isAnomaly) || execution.regions[2];
            onSelectRegion?.(anomaly);
            onInvestigateAnomaly?.();
          }}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-mono transition-colors shadow-lg backdrop-blur-md"
        >
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          <span>Investigate Divergence (Step 73)</span>
        </button>
      </div>
    </div>
  );
}
