import * as THREE from 'three';
import {WebGL} from './WebGL';

export class Frame extends WebGL {

    constructor() {
        // Initialize WebGL class
        super();
    }

    init() {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        this.scene.add( cube );

        this.camera.position.z = 5;

        const anim = () => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            
            this.renderer.render(this.scene, this.camera)
        }

        this.requestAnimationFrame(anim)
    }
}