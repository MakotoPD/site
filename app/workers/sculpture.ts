// The hero sculpture renders here, on an OffscreenCanvas. Shader compilation and every frame
// stay off the main thread, so the page remains responsive on slow phones.
import {
  ACESFilmicToneMapping,
  Box3,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

type Message =
  | { type: 'init'; canvas: OffscreenCanvas; width: number; height: number; ratio: number }
  | { type: 'size'; width: number; height: number }
  | { type: 'run'; active: boolean; reduce: boolean }
  | { type: 'point'; x: number; y: number }

let renderer: WebGLRenderer | undefined,
  camera: PerspectiveCamera | undefined,
  mesh: Group | undefined
const scene = new Scene()
const pointer = { x: 0, y: 0 }
let active = false,
  reduce = false,
  frame = 0,
  last = 0,
  motionTime = 0

function render(time: number) {
  frame = 0
  if (!renderer || !camera || !mesh) return
  const delta = Math.min((time - last) / 1000, 0.05)
  last = time
  if (!reduce) {
    motionTime += delta
    mesh.rotation.y = -0.15 + Math.sin(motionTime * 0.35) * 0.16
    mesh.rotation.z = -0.1 + Math.sin(motionTime * 0.25) * 0.035
    // Ease towards the pointer; the factor keeps the feel independent of the frame rate.
    const ease = 1 - Math.exp(-delta * 7)
    mesh.rotation.x += (0.05 + pointer.y * 0.25 - mesh.rotation.x) * ease
    mesh.position.x += (pointer.x * 0.25 - mesh.position.x) * ease
  }
  renderer.render(scene, camera)
  if (active && !reduce) frame = requestAnimationFrame(render)
}
function schedule() {
  if (!frame && renderer && mesh) frame = requestAnimationFrame(render)
}
function resize(width: number, height: number) {
  if (!renderer || !camera || !width || !height) return
  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  schedule()
}
async function init(data: Extract<Message, { type: 'init' }>) {
  // Software rendering would burn the CPU for a decorative element: keep the static fallback.
  renderer = new WebGLRenderer({
    canvas: data.canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
    failIfMajorPerformanceCaveat: true,
  })
  renderer.setPixelRatio(data.ratio)
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.6
  camera = new PerspectiveCamera(38, 1, 0.1, 100)
  camera.position.set(0, 0, 9)
  const pmrem = new PMREMGenerator(renderer),
    room = new RoomEnvironment()
  scene.environment = pmrem.fromScene(room, 0.04).texture
  room.dispose()
  pmrem.dispose()
  const material = new MeshPhysicalMaterial({
    color: 0xb3d7f3,
    metalness: 1,
    roughness: 0.19,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.8,
  })
  const model = (await new GLTFLoader().loadAsync('/models/makoto.glb')).scene
  model.traverse((node) => {
    if (node instanceof Mesh) node.material = material
  })
  const box = new Box3().setFromObject(model),
    dimensions = box.getSize(new Vector3())
  model.position.sub(box.getCenter(new Vector3()))
  mesh = new Group()
  mesh.add(model)
  mesh.scale.setScalar(4.5 / Math.max(dimensions.x, dimensions.y))
  mesh.rotation.set(0.05, -0.15, -0.1)
  scene.add(mesh)
  const light = new DirectionalLight(0xb9dfff, 4)
  light.position.set(3, 4, 5)
  const fill = new DirectionalLight(0x547ab9, 3)
  fill.position.set(-4, -2, 1)
  scene.add(light, fill)
  renderer.setSize(data.width, data.height, false)
  camera.aspect = data.width / data.height
  camera.updateProjectionMatrix()
  // The first frame compiles the shaders; in a worker that wait is invisible to the page.
  renderer.render(scene, camera)
  postMessage({ type: 'ready' })
  if (active) schedule()
}
addEventListener('message', ({ data }: MessageEvent<Message>) => {
  if (data.type === 'init') init(data).catch(() => postMessage({ type: 'failed' }))
  else if (data.type === 'size') resize(data.width, data.height)
  else if (data.type === 'point') Object.assign(pointer, { x: data.x, y: data.y })
  else {
    active = data.active
    reduce = data.reduce
    if (active) schedule()
  }
})
