import * as THREE from 'three';
import {WebGL} from './WebGL';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { degToRad } from 'three/src/math/MathUtils.js';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export class Frame extends WebGL {

    private physics_objects: Array<THREE.Mesh>;
    public pointer: THREE.Vector2;
    public raycaster: THREE.Raycaster;

    constructor() {
        // Initialize WebGL class
        super();

        this.physics_objects = new Array<THREE.Mesh>();
        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2(-1000, -1000) // Placeholder values


        this.init();

        window.addEventListener('click', this.onClick);

        window.addEventListener('mousemove', (event) => {
            this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
          })
    }

    private loadBackground() {
        let rgbeloader = new RGBELoader();

        // Get progress bar with tag "progressBar"
        const progressBar = document.getElementById(
            'progressBar'
        ) as HTMLProgressElement
        
        // Hide canvas until loading is finished
        this.renderer.domElement.style.display = 'none';

        // Initially set progress bar value to zero
        progressBar.value = 0;

        rgbeloader.load('sunset.hdr',
        // Called when completed
        (texture) => {
            progressBar.style.display = 'none'
            this.renderer.domElement.style.display = 'block'

            texture.mapping = THREE.EquirectangularReflectionMapping;

            this.scene.background = texture;
            this.scene.environment = texture;
        },
        // Callback for when load is in progress
        (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total) * 100

            // Update progress bar
            progressBar.value = percentComplete === Infinity ? 100 : percentComplete
        },
        (error) => {
            console.log(error);
        });
    }

    init() {
        this.loadBackground();
        
        this.scene.add(new THREE.AxesHelper(5))

        const controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.camera.position.set( 0, 0, 5 );
        controls.update();

        // const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 0.5);
        // dirLight.position.set( 0, 5, 2);
        // //dirLight.lookAt(0,1,0);
        // dirLight.castShadow = true;
        // this.scene.add( dirLight, dirLightHelper);

        this.renderer.shadowMap.enabled = true;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;

        this.scene.background = new THREE.Color( 0xa0a0a0 );
		//this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
        

        const ambient_light = new THREE.AmbientLight( 0xffffff, 0.5);
        this.scene.add(ambient_light);

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 1 );
        hemiLight.position.set( 0, 20, 0 );
        this.scene.add( hemiLight );

        const point_light = new THREE.PointLight( 0xffffff, 10, 0, 1 );
        const pointLightHelper = new THREE.PointLightHelper(point_light, 0.5);
        point_light.position.set( 0, 5, 0 );
        point_light.castShadow = true;
        this.scene.add( point_light, pointLightHelper );

        const texture = new THREE.CanvasTexture(new FlakesTexture());
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = 10;
        texture.repeat.y = 6;

        const objMaterial = {
            metalness: 1.0,
            roughness: 0.5,
            color: 0x8418ca,
            normalMap: texture,
            normalScale: new THREE.Vector2(0.15, 0.15)
        }
        
        const cube_geometry = new THREE.BoxGeometry( 1, 1, 1 );
        //const depth_mat = new THREE.MeshDepthMaterial();
        const cube = new THREE.Mesh( cube_geometry, new THREE.MeshPhongMaterial({ color: 0xff0000 }));
        cube.castShadow = true;
        cube.position.set(0,0,-5);
        this.physics_objects.push(cube);
        this.scene.add( cube );

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshStandardMaterial(objMaterial));
        sphere.castShadow = true;
        this.physics_objects.push(sphere);
        this.scene.add( sphere );

        const planeMaterial = {
            metalness: 1.0,
            roughness: 0.5,
            color: 0x000000,
            normalMap: texture,
            normalScale: new THREE.Vector2(.05, .05)
        }

        const plane = new THREE.Mesh(new THREE.PlaneGeometry( 200, 200), new THREE.MeshStandardMaterial(planeMaterial));
        plane.material.side = THREE.DoubleSide;
        plane.position.set(0,-1,0);
        plane.rotation.x = degToRad(90);
        plane.receiveShadow = true;
        this.scene.add(plane);

        const anim = () => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            
            //this.camera.rotation.x -= degToRad(-.5);

            //controls.minPolarAngle = Math.PI/2;
            //controls.maxPolarAngle = Math.PI/2;

            // required if controls.enableDamping or controls.autoRotate are set to true
	        controls.update();
            
            this.renderer.render(this.scene, this.camera)
        }

        this.requestAnimationFrame(anim)
    }

    private onClick = () => {
        this.raycaster.setFromCamera(this.pointer, this.camera)
    
        const intersects = this.raycaster.intersectObjects(this.physics_objects, false)
        if (intersects.length > 0) {
            const n = new THREE.Vector3()
            n.copy((intersects[0].face as THREE.Face).normal)
            n.transformDirection(intersects[0].object.matrixWorld)
    
            const cone = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 8), new THREE.MeshNormalMaterial())
    
            cone.lookAt(n)
            cone.rotateX(Math.PI / 2)
            cone.position.copy(intersects[0].point)
            cone.position.addScaledVector(n, 0.1)
    
            this.scene.add(cone)
        }
    }
}