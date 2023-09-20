import * as THREE from 'three';

export class WebGL {
	public renderer: THREE.WebGLRenderer
	public scene: THREE.Scene
	public camera: THREE.PerspectiveCamera

	public time = { delta: 0, elapsed: 0 }
	private clock = new THREE.Clock()

	private resizeCallback?: () => void
  
	constructor() {
	  const { width, height, aspect } = this.size
  
	  // Initialize renderer
	  this.renderer = new THREE.WebGLRenderer({alpha: true})

	  // Set size
	  this.renderer.setPixelRatio(window.devicePixelRatio)
	  this.renderer.setSize(width, height)
  
	  this.scene = new THREE.Scene()
	  this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000 )
  
	  // Resize canvas when window is resized
	  window.addEventListener('resize', this.handleResize)
	}
  
	private handleResize = () => {
	  this.resizeCallback && this.resizeCallback()
  
	  const { width, height, aspect } = this.size
	  this.camera.aspect = aspect
	  this.camera.updateProjectionMatrix()
	  this.renderer.setSize(width, height)
	}
  
	get size() {
	  const { innerWidth: width, innerHeight: height } = window
	  return { width, height, aspect: width / height }
	}
  
	setup(container: HTMLElement) {
	  container.appendChild(this.renderer.domElement)
	}
  
	setResizeCallback(callback: () => void) {
	  this.resizeCallback = callback
	}
  
	getMesh<T extends THREE.Material>(name: string) {
	  return this.scene.getObjectByName(name) as THREE.Mesh<THREE.BufferGeometry, T>
	}
  
	render() {
	  	this.renderer.render(this.scene, this.camera)
	}
  
	requestAnimationFrame(callback: () => void) {
	  	this.renderer.setAnimationLoop(() => {
		this.time.delta = this.clock.getDelta()
		this.time.elapsed = this.clock.getElapsedTime()
		callback()
	  })
	}
  
	cancelAnimationFrame() {
	  this.renderer.setAnimationLoop(null)
	}
  
	dispose() {
	  this.cancelAnimationFrame()
	  this.scene?.clear()
	}
  }