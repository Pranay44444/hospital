// three.js 3D torus + extruded medical cross for OPD Flow hero.
// Matches the reference sculpture: rounded red ring around a chunky rounded plus.
import * as THREE from 'https://esm.sh/three@0.160.0';

function mount() {
  const host = document.getElementById('three-stage');
  if (!host) return;

  // Clear any previous canvas (hot reload safety)
  host.innerHTML = '';

  const W = host.clientWidth || 560;
  const H = host.clientHeight || 560;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
  camera.position.set(0, 0.4, 9);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.appendChild(renderer.domElement);
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';

  // Group for the whole sculpture
  const group = new THREE.Group();
  scene.add(group);

  // Shared red material — warm matte-plastic look like the reference
  const redMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ee3a1c'),
    roughness: 0.42,
    metalness: 0.04,
    clearcoat: 0.45,
    clearcoatRoughness: 0.35,
    sheen: 0.2,
    sheenColor: new THREE.Color('#ff7a4a'),
  });

  // ----- Torus -----
  const torusGeo = new THREE.TorusGeometry(2.2, 0.55, 48, 160);
  const torus = new THREE.Mesh(torusGeo, redMat);
  torus.castShadow = true;
  torus.receiveShadow = true;
  group.add(torus);

  // ----- Extruded rounded plus -----
  // Build a plus-sign Shape, then ExtrudeGeometry with bevel.
  const plusShape = new THREE.Shape();
  const w = 1.45;       // long dimension of each arm
  const t = 0.55;       // arm thickness (half)
  const r = 0.18;       // corner radius
  // 12 corners around the outline; use absellipse for each rounded corner.
  const pts = [
    [-t + r, -w],       // bottom-left of bottom arm (start after corner)
    [ t - r, -w],
    [ t    , -w + r],
    [ t    , -t - r],
    [ t + r, -t],
    [ w - r, -t],
    [ w    , -t + r],
    [ w    ,  t - r],
    [ w - r,  t],
    [ t + r,  t],
    [ t    ,  t + r],
    [ t    ,  w - r],
    [ t - r,  w],
    [-t + r,  w],
    [-t    ,  w - r],
    [-t    ,  t + r],
    [-t - r,  t],
    [-w + r,  t],
    [-w    ,  t - r],
    [-w    , -t + r],
    [-w + r, -t],
    [-t - r, -t],
    [-t    , -t - r],
    [-t    , -w + r],
  ];
  // Rather than hand-code arcs, build a simple rounded-rect plus via manually filleting each outer corner with an arc.
  // We'll just move to the first point and approximate corners with quadraticCurveTo for brevity.
  plusShape.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    // if segment is a "corner" (diagonal change), insert quadratic
    const dx = cur[0] - prev[0];
    const dy = cur[1] - prev[1];
    if (dx !== 0 && dy !== 0) {
      // corner point (midway L-bend) — use prev x/y turn as control
      const cx = (Math.abs(dx) < Math.abs(dy)) ? cur[0] : prev[0];
      const cy = (Math.abs(dx) < Math.abs(dy)) ? prev[1] : cur[1];
      plusShape.quadraticCurveTo(cx, cy, cur[0], cur[1]);
    } else {
      plusShape.lineTo(cur[0], cur[1]);
    }
  }
  plusShape.closePath();

  const plusGeo = new THREE.ExtrudeGeometry(plusShape, {
    depth: 0.9,
    bevelEnabled: true,
    bevelThickness: 0.14,
    bevelSize: 0.12,
    bevelSegments: 6,
    curveSegments: 18,
  });
  plusGeo.center(); // center along Z too
  const plus = new THREE.Mesh(plusGeo, redMat);
  plus.castShadow = true;
  plus.receiveShadow = true;
  group.add(plus);

  // ----- Lighting -----
  const amb = new THREE.AmbientLight(0xfff0e6, 0.55);
  scene.add(amb);

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-4, 6, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 8;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xffccaa, 1.0);
  rim.position.set(5, -2, -4);
  scene.add(rim);

  const fill = new THREE.PointLight(0xffd4b8, 0.8, 25);
  fill.position.set(3, 1, 5);
  scene.add(fill);

  // ----- Animate -----
  let t0 = performance.now();
  let raf = 0;
  function tick(now) {
    const dt = (now - t0) / 1000;
    // oscillate so it reads as true 3D
    group.rotation.y = Math.sin(dt * 0.35) * 0.9;
    group.rotation.x = Math.sin(dt * 0.25) * 0.25 - 0.08;
    plus.rotation.z = Math.sin(dt * 0.18) * 0.08;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  // Resize
  function onResize() {
    const w2 = host.clientWidth, h2 = host.clientHeight;
    if (!w2 || !h2) return;
    camera.aspect = w2 / h2;
    camera.updateProjectionMatrix();
    renderer.setSize(w2, h2);
  }
  const ro = new ResizeObserver(onResize);
  ro.observe(host);
}

// Wait for React to mount #three-stage
function waitAndMount() {
  const host = document.getElementById('three-stage');
  if (host) return mount();
  setTimeout(waitAndMount, 80);
}
waitAndMount();
