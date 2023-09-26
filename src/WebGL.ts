import * as THREE from 'three';

export abstract class WebGL {
	public renderer: THREE.WebGLRenderer
	public scene: THREE.Scene
	public camera: THREE.PerspectiveCamera

	public time = { delta: 0, elapsed: 0 }
	private clock = new THREE.Clock()

	private resizeCallback?: () => void
  
	constructor() {
	  const { width, height, aspect } = this.size
  
	  // Initialize renderer
	  this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})

	  // Set size
	  this.renderer.setPixelRatio(window.devicePixelRatio)
	  this.renderer.setSize(width, height)
  
	  this.scene = new THREE.Scene()
	  this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000 )
	  this.camera.up.set(0,1,0);
  
	  // Resize canvas when window is resized
	  window.addEventListener('resize', this.handleResize)
	}

	abstract init(): void;
  
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
  
	attach(container: HTMLElement) {
		// Attach frame to container
	  	container.appendChild(this.renderer.domElement)
	}
  
 	setResizeCallback(callback: () => void) {
	  this.resizeCallback = callback
	}
  
	getMesh<T extends THREE.Material>(name: string) {
	  return this.scene.getObjectByName(name) as THREE.Mesh<THREE.BufferGeometry, T>
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