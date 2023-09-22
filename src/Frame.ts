import * as THREE from 'three';
import {WebGL} from './WebGL';

export class Frame {
    private gl: WebGL;

    constructor() {
        // Initialize WebGL class
        this.gl = new WebGL();

        this.init();
    }

    public attach(container: HTMLElement) {
        // Add canvas to html element
        this.gl.setup(container);
    }

    public init() {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        this.gl.scene.add( cube );

        this.gl.camera.position.z = 5;

        const anim = () => {
            this.gl.render()
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }

        this.gl.requestAnimationFrame(anim)
    }
}