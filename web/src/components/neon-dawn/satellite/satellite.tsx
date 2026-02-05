import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js"
import { AmbientLight, Object3D, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";

export default () => {
    const scene = new Scene();
    const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const ambientLight = new AmbientLight(0xffffff, 1.75);
    const renderer = new WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth , window.innerHeight );
    renderer.domElement.id = "satellite"
    document.body.querySelector("header")?.appendChild(renderer.domElement)

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    let satellite: Object3D | null = null
    loader.load('/neon-dawn/satellite.glb', function (gltf) {
        satellite = gltf.scene.children[0]
        scene.add(ambientLight);
        scene.add(satellite);
        
        camera.position.z = 5;
        satellite.position.set(4, -1.5, 0)
        satellite.scale.set(3, 3, 3)
    }, undefined, console.error);

    const mouse = new Vector2();
    function onMouseMove(event: MouseEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        
        if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
        ) return
        // normalisé sur [-1, 1]
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    window.addEventListener('mousemove', onMouseMove);

    function animate() {
        if(satellite) satellite.rotation
            .set(mouse.y * 0.25, -mouse.x * 0.25 - 1.25, 0);
        
        renderer.render( scene, camera );
    }
    renderer.setAnimationLoop( animate );

    return <>
    </>
}