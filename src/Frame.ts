import {WebGL} from './WebGL'

export class Frame {
    private gl: WebGL;

    constructor(container: HTMLElement) {
        // Initialize WebGL class
        this.gl = new WebGL();

        // Add canvas to html element
        this.gl.setup(container);
    }
}