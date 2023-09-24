import * as THREE from 'three';
import {WebGL} from './WebGL';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { degToRad } from 'three/src/math/MathUtils.js';

export class Frame extends WebGL {

    constructor() {
        // Initialize WebGL class
        super();
    }

    init() {
        // const dir = new THREE.Vector3( 0, 1, 0 );

        // //normalize the direction vector (convert to vector of length 1)
        // dir.normalize();

        // const origin = new THREE.Vector3( 0, 0, 0 );
        // const length = 1;
        // const hex = 0xffff00;

        // const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
        // this.scene.add( arrowHelper );
        //this.camera.position.y = 5;

        const controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.camera.position.set( 0, 0, 5 );
        controls.update();

        const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.position.set( - 3, 10, - 10 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 4;
        dirLight.shadow.camera.bottom = - 4;
        dirLight.shadow.camera.left = - 4;
        dirLight.shadow.camera.right = 4;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        this.scene.add( dirLight );

        this.renderer.shadowMap.enabled = true;

        this.scene.background = new THREE.Color( 0xa0a0a0 );
		//this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
        

        //const ambient_light = new THREE.AmbientLight( 0x404040 );
        //this.scene.add(ambient_light);

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
        hemiLight.position.set( 0, 20, 0 );
        this.scene.add( hemiLight );

        // const point_light = new THREE.PointLight( 0xff0000, 1, 0, 0 );
        // point_light.position.set( 0, 2, 0 );
        // this.scene.add( point_light );

        const cube_geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
        //const depth_mat = new THREE.MeshDepthMaterial();
        const cube = new THREE.Mesh( cube_geometry, material );
        cube.castShadow = true;
        this.scene.add( cube );

        const plane_geometry = new THREE.PlaneGeometry( 200, 200);
        const plane = new THREE.Mesh(plane_geometry, new THREE.MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ));
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
}