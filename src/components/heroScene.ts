import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * Hero background: a cluster of glass cubes on an orbit ring, above a wave of particles.
 * Returns a cleanup function.
 */
export function createHeroScene(container: HTMLElement, theme: 'dark' | 'light') {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = theme === 'dark' ? 0.45 : 0.8

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
  camera.position.set(0, 0.6, 12)

  // ----- Cube cluster -----
  const cluster = new THREE.Group()
  scene.add(cluster)

  const glass = new THREE.MeshPhysicalMaterial({
    color: theme === 'dark' ? 0x4a5cff : 0x5a6cff,
    emissive: 0x2b2a9e,
    emissiveIntensity: theme === 'dark' ? 0.45 : 0.2,
    metalness: 0.1,
    roughness: 0.12,
    transmission: 0.8,
    thickness: 1.2,
    ior: 1.45,
    iridescence: 0.6,
    iridescenceIOR: 1.3,
    clearcoat: 1,
    transparent: true,
    opacity: 0.95,
  })
  const edgeMat = new THREE.LineBasicMaterial({
    color: theme === 'dark' ? 0xb4c2ff : 0x3b5bff,
    transparent: true,
    opacity: theme === 'dark' ? 0.95 : 0.7,
  })

  const cubes: { mesh: THREE.Object3D; spin: THREE.Vector3; base: THREE.Vector3 }[] = []
  const addCube = (size: number, pos: [number, number, number], rot: [number, number, number]) => {
    const geo = new THREE.BoxGeometry(size, size, size)
    const group = new THREE.Group()
    group.add(new THREE.Mesh(geo, glass))
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat))
    group.position.set(...pos)
    group.rotation.set(...rot)
    cluster.add(group)
    cubes.push({
      mesh: group,
      spin: new THREE.Vector3(Math.random() * 0.15, 0.1 + Math.random() * 0.2, Math.random() * 0.1),
      base: new THREE.Vector3(...pos),
    })
  }
  addCube(1.9, [0, 0, 0], [0.6, 0.7, 0.2])
  addCube(1.25, [0.35, 1.9, -0.6], [0.3, 0.4, 0.5])
  addCube(1.15, [1.6, -0.1, 0.4], [0.9, 0.2, 0.3])
  addCube(0.75, [-1.5, 0.95, -0.4], [0.4, 0.9, 0.1])
  addCube(0.95, [-0.3, -1.25, 0.9], [0.2, 0.5, 0.8])

  // Inner glow
  const glow = new THREE.PointLight(0x7c6cff, 18, 6)
  cluster.add(glow)

  // ----- Orbit ring -----
  const curve = new THREE.EllipseCurve(0, 0, 3.6, 1.5, 0, Math.PI * 2)
  const ringPts = curve.getPoints(160).map((p) => new THREE.Vector3(p.x, 0, p.y))
  const ring = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(ringPts),
    new THREE.LineBasicMaterial({ color: 0x9aa8ff, transparent: true, opacity: 0.55 }),
  )
  const ringGroup = new THREE.Group()
  ringGroup.rotation.set(0.35, 0, -0.32)
  ringGroup.add(ring)
  cluster.add(ringGroup)

  const orbiters: { mesh: THREE.Mesh; t: number; speed: number }[] = []
  ;[0, 2.1, 4.3].forEach((t, i) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(i === 0 ? 0.13 : 0.09, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x8fa6ff, emissive: 0x5a78ff, emissiveIntensity: 1.6 }),
    )
    ringGroup.add(m)
    orbiters.push({ mesh: m, t, speed: 0.12 + i * 0.03 })
  })

  // ----- Lights -----
  scene.add(new THREE.AmbientLight(0x8090ff, theme === 'dark' ? 0.35 : 0.8))
  const key = new THREE.DirectionalLight(0xb9c4ff, 2.2)
  key.position.set(4, 6, 6)
  scene.add(key)
  const rim = new THREE.PointLight(0x8b5cf6, 40, 20)
  rim.position.set(-4, -2, 3)
  scene.add(rim)

  // ----- Particle wave -----
  const cols = 140
  const rows = 46
  const positions = new Float32Array(cols * rows * 3)
  const wave = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({
      color: theme === 'dark' ? 0x6d7fff : 0x4c63ff,
      size: 0.045,
      transparent: true,
      opacity: theme === 'dark' ? 0.7 : 0.45,
      depthWrite: false,
    }),
  )
  wave.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  wave.position.set(0, -3.4, -2)
  scene.add(wave)

  const updateWave = (time: number) => {
    let i = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c / (cols - 1) - 0.5) * 30
        const z = (r / (rows - 1) - 0.5) * 10
        const y =
          Math.sin(x * 0.35 + time * 0.6) * 0.35 +
          Math.cos(z * 0.6 + x * 0.12 + time * 0.4) * 0.25 +
          Math.max(0, x) * 0.06
        positions[i++] = x
        positions[i++] = y
        positions[i++] = z
      }
    }
    wave.geometry.attributes.position.needsUpdate = true
  }

  // ----- Layout -----
  const resize = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const desktop = w > 900
    // Place the cluster on the right on desktop, at the top on mobile.
    cluster.position.set(desktop ? Math.min(4.6, 2.2 * camera.aspect) : 0, desktop ? 0.9 : 2.6, 0)
    cluster.scale.setScalar(desktop ? 1 : 0.62)
  }
  resize()
  const ro = new ResizeObserver(() => {
    resize()
    if (reduceMotion) render()
  })
  ro.observe(container)

  // Mouse parallax
  const target = new THREE.Vector2()
  const onMove = (e: PointerEvent) => {
    target.set(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5)
  }
  window.addEventListener('pointermove', onMove)

  const clock = new THREE.Clock()
  let frame = 0
  let visible = true
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
  io.observe(container)

  const render = () => {
    const t = clock.getElapsedTime()
    cubes.forEach(({ mesh, spin, base }, i) => {
      mesh.rotation.x += spin.x * 0.01
      mesh.rotation.y += spin.y * 0.01
      mesh.position.y = base.y + Math.sin(t * 0.8 + i) * 0.06
    })
    orbiters.forEach((o) => {
      const p = curve.getPoint(((o.t + t * o.speed) / (Math.PI * 2)) % 1)
      o.mesh.position.set(p.x, 0, p.y)
    })
    cluster.rotation.y += (target.x * 0.5 - cluster.rotation.y) * 0.04
    cluster.rotation.x += (target.y * 0.25 - cluster.rotation.x) * 0.04
    updateWave(t)
    renderer.render(scene, camera)
  }

  const loop = () => {
    frame = requestAnimationFrame(loop)
    if (visible) render()
  }
  if (reduceMotion) {
    updateWave(0)
    render()
  } else {
    loop()
  }

  return () => {
    cancelAnimationFrame(frame)
    ro.disconnect()
    io.disconnect()
    window.removeEventListener('pointermove', onMove)
    renderer.dispose()
    pmrem.dispose()
    container.removeChild(renderer.domElement)
  }
}
