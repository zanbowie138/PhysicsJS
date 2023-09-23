import {Frame} from './Frame'

const container = document.querySelector<HTMLDivElement>('.webgl-canvas__container');

if (container != null) {
    let m_canvas = new Frame();
    m_canvas.attach(container);
    
    // window.addEventListener('beforeunload', () => {
    //     m_canvas.dispose();
    //   })
} else {
    console.error("WebGL canvas container not found!");
}