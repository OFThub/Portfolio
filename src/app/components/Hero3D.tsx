"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/*
 * Hero3D — "Digital Core"
 * Kırmızı ember temasına uygun, hero arkasında dönen parçacık küresi:
 *   - Fibonacci dağılımlı parçacık kabuğu + dış toz bulutu (2 draw call)
 *   - İç tel-kafes ikosahedron + eğik yörünge halkaları
 *   - Mouse paralaks, nefes alma (scale pulse), giriş animasyonu
 *
 * FPS güvenceleri:
 *   - DPR üst sınırı (mobil 1.5 / masaüstü 2)
 *   - Cihaz gücüne göre parçacık bütçesi
 *   - Sekme gizlenince veya hero ekran dışına çıkınca rAF durur
 *   - İlk saniyelerde kare süresi ölçülür; yavaşsa kalite bir kez düşürülür
 *   - prefers-reduced-motion: tek statik kare, döngü yok
 */

const SHELL_RADIUS = 9;

function particleBudget() {
  const small = window.innerWidth < 768;
  const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
  return small || weak
    ? { shell: 900, dust: 350 }
    : { shell: 1600, dust: 650 };
}

/* Yumuşak kenarlı yuvarlak nokta sprite'ı (canvas'tan üretilir, network yok) */
function makeDotTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.7)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/* Fibonacci küresi üzerinde eşit dağılımlı kabuk parçacıkları */
function buildShell(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const jitter = 1 + (Math.random() - 0.5) * 0.08;

    positions[i * 3] = Math.cos(theta) * r * SHELL_RADIUS * jitter;
    positions[i * 3 + 1] = y * SHELL_RADIUS * jitter;
    positions[i * 3 + 2] = Math.sin(theta) * r * SHELL_RADIUS * jitter;

    // %8 "akkor" parçacık, kalanı koyu-parlak kırmızı bandı
    if (Math.random() < 0.08) {
      color.setHSL(0.07, 1.0, 0.82);
    } else {
      color.setHSL(Math.random() * 0.05, 0.9, 0.4 + Math.random() * 0.32);
    }
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

/* Kürenin dışında derinlik hissi veren seyrek toz bulutu */
function buildDust(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();
  const dir = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    dir
      .set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
      .normalize();
    const radius = SHELL_RADIUS * (1.25 + Math.random() * 1.8);

    positions[i * 3] = dir.x * radius;
    positions[i * 3 + 1] = dir.y * radius * 0.7; // hafif basık — galaksi hissi
    positions[i * 3 + 2] = dir.z * radius;

    color.setHSL(Math.random() * 0.06, 0.85, 0.25 + Math.random() * 0.25);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

/* Eğik yörünge halkası (LineLoop — tek draw call) */
function buildRing(radius: number, tiltX: number, tiltZ: number) {
  const points: THREE.Vector3[] = [];
  const SEGMENTS = 128;
  for (let i = 0; i < SEGMENTS; i++) {
    const a = (i / SEGMENTS) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({
    color: 0xef4444,
    transparent: true,
    opacity: 0,
  });
  const ring = new THREE.LineLoop(geo, mat);
  ring.rotation.x = tiltX;
  ring.rotation.z = tiltZ;
  return ring;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const budget = particleBudget();

    // Nokta tabanlı sahnede AA görsel fark yaratmaz; entegre GPU'larda pahalı
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    const maxDPR = window.innerWidth < 768 ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDPR));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 26;

    // Paralaks tüm sahne grubuna uygulanır
    const parallaxGroup = new THREE.Group();
    scene.add(parallaxGroup);
    const coreGroup = new THREE.Group();
    parallaxGroup.add(coreGroup);

    const dotTexture = makeDotTexture();

    const shellGeo = buildShell(budget.shell);
    const shellMat = new THREE.PointsMaterial({
      size: 0.13,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const shell = new THREE.Points(shellGeo, shellMat);
    coreGroup.add(shell);

    const dustGeo = buildDust(budget.dust);
    const dustMat = new THREE.PointsMaterial({
      size: 0.09,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    coreGroup.add(dust);

    const icoGeo = new THREE.WireframeGeometry(
      new THREE.IcosahedronGeometry(SHELL_RADIUS * 0.5, 1)
    );
    const icoMat = new THREE.LineBasicMaterial({
      color: 0xdc2626,
      transparent: true,
      opacity: 0,
    });
    const ico = new THREE.LineSegments(icoGeo, icoMat);
    coreGroup.add(ico);

    const ring1 = buildRing(SHELL_RADIUS * 1.35, Math.PI / 2.6, 0.3);
    const ring2 = buildRing(SHELL_RADIUS * 1.6, Math.PI / 2.1, -0.5);
    const ring1Mat = ring1.material as THREE.LineBasicMaterial;
    const ring2Mat = ring2.material as THREE.LineBasicMaterial;
    coreGroup.add(ring1, ring2);

    // Hedef opaklıklar (giriş animasyonunda bunlara doğru açılır)
    const targetOpacity = { shell: 0.9, dust: 0.55, ico: 0.22, ring1: 0.28, ring2: 0.16 };

    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const disposeAll = () => {
      resizeObserver.disconnect();
      [shellGeo, dustGeo, icoGeo, ring1.geometry, ring2.geometry].forEach((g) => g.dispose());
      [shellMat, dustMat, icoMat, ring1Mat, ring2Mat].forEach((m) => m.dispose());
      dotTexture.dispose();
      renderer.dispose();
    };

    // ── Statik mod: reduced-motion tercih edenlere tek kare ──
    if (reducedMotion) {
      shellMat.opacity = targetOpacity.shell * 0.8;
      dustMat.opacity = targetOpacity.dust * 0.8;
      icoMat.opacity = targetOpacity.ico;
      ring1Mat.opacity = targetOpacity.ring1;
      ring2Mat.opacity = targetOpacity.ring2;
      coreGroup.rotation.x = 0.2;
      renderer.render(scene, camera);
      return disposeAll;
    }

    // ── Canlı mod ──
    const mouse = { tx: 0, ty: 0 };
    function onPointerMove(e: PointerEvent) {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 0.45;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 0.3;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let rafId = 0;
    let running = false;
    let inView = true;
    let elapsed = 0;
    let last = performance.now();

    // Adaptif kalite: ilk ~2 sn ortalama kare süresi kötüyse bir kez düşür
    let frameCount = 0;
    let frameTimeSum = 0;
    let degraded = false;
    function degradeQuality() {
      degraded = true;
      renderer.setPixelRatio(1);
      shellGeo.setDrawRange(0, Math.floor(budget.shell * 0.55));
      dustGeo.setDrawRange(0, Math.floor(budget.dust * 0.4));
    }

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;

      if (!degraded && elapsed > 0.5) {
        frameCount++;
        frameTimeSum += dt;
        if (frameCount === 90 && frameTimeSum / frameCount > 0.0185) degradeQuality();
      }

      // Giriş: 1.6 sn'de scale + opaklık açılışı
      const intro = easeOutCubic(Math.min(1, elapsed / 1.6));
      coreGroup.scale.setScalar(0.7 + intro * 0.3);
      shellMat.opacity = targetOpacity.shell * intro;
      dustMat.opacity = targetOpacity.dust * intro;
      icoMat.opacity = targetOpacity.ico * intro;
      ring1Mat.opacity = targetOpacity.ring1 * intro;
      ring2Mat.opacity = targetOpacity.ring2 * intro;

      // Sürekli hareket
      shell.rotation.y += dt * 0.07;
      dust.rotation.y -= dt * 0.03;
      ico.rotation.y -= dt * 0.12;
      ico.rotation.x += dt * 0.05;
      ring1.rotation.z += dt * 0.1;
      ring2.rotation.z -= dt * 0.07;

      // Nefes alma
      const breathe = 1 + Math.sin(elapsed * 0.6) * 0.02;
      shell.scale.setScalar(breathe);

      // Mouse paralaks (lerp)
      parallaxGroup.rotation.y += (mouse.tx - parallaxGroup.rotation.y) * 0.04;
      parallaxGroup.rotation.x += (mouse.ty + 0.15 - parallaxGroup.rotation.x) * 0.04;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (running || !inView || document.hidden) return;
      running = true;
      last = performance.now();
      rafId = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(container);

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      disposeAll();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
