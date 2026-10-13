<script setup lang="ts">
const host = ref<HTMLDivElement | null>(null)
let dispose: (() => void) | undefined
let disposed = false
onMounted(async () => {
  const THREE = await import('three')
  const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
  const { gsap } = await import('gsap')
  if (disposed || !host.value) return
  let renderer: InstanceType<typeof THREE.WebGLRenderer>
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })
  } catch {
    return
  }
  const container = host.value
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.6
  container.appendChild(renderer.domElement)
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
  camera.position.set(0, 0, 9)
  const pmrem = new THREE.PMREMGenerator(renderer),
    room = new RoomEnvironment()
  const environment = pmrem.fromScene(room, 0.04)
  scene.environment = environment.texture
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xb3d7f3,
    metalness: 1,
    roughness: 0.19,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.8,
  })
  let gltf
  try {
    gltf = await new GLTFLoader().loadAsync('/models/makoto.glb')
  } catch {
    material.dispose()
    environment.dispose()
    room.dispose()
    pmrem.dispose()
    renderer.dispose()
    renderer.domElement.remove()
    return
  }
  if (disposed) {
    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.geometry.dispose()
        ;(Array.isArray(node.material) ? node.material : [node.material]).forEach((m) =>
          m.dispose(),
        )
      }
    })
    material.dispose()
    environment.dispose()
    room.dispose()
    pmrem.dispose()
    renderer.dispose()
    renderer.domElement.remove()
    return
  }
  const model = gltf.scene,
    geometries: InstanceType<typeof THREE.BufferGeometry>[] = []
  model.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      geometries.push(node.geometry)
      const original = Array.isArray(node.material) ? node.material : [node.material]
      original.forEach((m) => m.dispose())
      node.material = material
    }
  })
  const box = new THREE.Box3().setFromObject(model),
    center = box.getCenter(new THREE.Vector3()),
    dimensions = box.getSize(new THREE.Vector3())
  model.position.sub(center)
  const mesh = new THREE.Group()
  mesh.add(model)
  mesh.scale.setScalar(4.5 / Math.max(dimensions.x, dimensions.y))
  mesh.rotation.set(0.05, -0.15, -0.1)
  scene.add(mesh)
  const light = new THREE.DirectionalLight(0xb9dfff, 4)
  light.position.set(3, 4, 5)
  scene.add(light)
  const fill = new THREE.DirectionalLight(0x547ab9, 3)
  fill.position.set(-4, -2, 1)
  scene.add(fill)
  const size = () => {
    const { width, height } = container.getBoundingClientRect()
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.render(scene, camera)
  }
  const observer = new ResizeObserver(size)
  observer.observe(container)
  size()
  const reduce = matchMedia('(prefers-reduced-motion: reduce)')
  let visible = true,
    frame = 0,
    last = 0,
    motionTime = 0
  const render = (time: number) => {
    const delta = Math.min((time - last) / 1000, 0.05)
    last = time
    if (!reduce.matches) {
      motionTime += delta
      mesh.rotation.y = -0.15 + Math.sin(motionTime * 0.35) * 0.16
      mesh.rotation.z = -0.1 + Math.sin(motionTime * 0.25) * 0.035
    }
    renderer.render(scene, camera)
    if (visible && !document.hidden && !reduce.matches) frame = requestAnimationFrame(render)
  }
  const start = () => {
    cancelAnimationFrame(frame)
    if (visible && !document.hidden) frame = requestAnimationFrame(render)
  }
  const intersection = new IntersectionObserver((entries) => {
    visible = Boolean(entries[0]?.isIntersecting)
    start()
  })
  intersection.observe(container)
  const move = (event: PointerEvent) => {
    if (reduce.matches || event.pointerType !== 'mouse') return
    const rect = container.getBoundingClientRect()
    gsap.to(mesh.rotation, {
      x: 0.05 + ((event.clientY - rect.top) / rect.height - 0.5) * 0.25,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: true,
    })
    gsap.to(mesh.position, {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 0.25,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: true,
    })
  }
  container.addEventListener('pointermove', move)
  document.addEventListener('visibilitychange', start)
  reduce.addEventListener('change', start)
  container.classList.add('sculpture-ready')
  dispose = () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    intersection.disconnect()
    container.removeEventListener('pointermove', move)
    document.removeEventListener('visibilitychange', start)
    reduce.removeEventListener('change', start)
    gsap.killTweensOf(mesh.rotation)
    gsap.killTweensOf(mesh.position)
    geometries.forEach((g) => g.dispose())
    material.dispose()
    environment.dispose()
    room.dispose()
    pmrem.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }
})
onBeforeUnmount(() => {
  disposed = true
  dispose?.()
})
</script>
<template>
  <div
    ref="host"
    data-ui="sculpture"
    class="
      absolute top-5 right-[-15px] bottom-[-25px] left-[-15px] max-[760px]:top-0
      max-[760px]:right-0 max-[760px]:bottom-0 max-[760px]:left-0 [&_canvas]:relative
      [&_canvas]:z-[1] [&_canvas]:h-full [&_canvas]:w-full
      [&.sculpture-ready_[data-ui~=sculpture-fallback]]:hidden
    "
    aria-hidden="true"
  >
    <div
      data-ui="sculpture-fallback"
      class="
        absolute top-0 right-0 bottom-0 left-0 grid h-full w-full place-items-center
        [&_img]:h-auto [&_img]:w-[68%]
      "
    >
      <img
        src="/brand/makoto.webp"
        alt=""
        width="188"
        height="40"
      />
    </div>
  </div>
</template>
