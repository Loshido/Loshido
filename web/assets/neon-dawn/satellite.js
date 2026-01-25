if(window.innerWidth < 800) {
    throw new Error('window\'s size too small')
}

// Ce format permet au navigateur de ne pas télécharger du javascript si l'erreur au dessus est déclenchée
const THREE = await import('three')
const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js')
const { MeshoptDecoder } = await import('three/addons/libs/meshopt_decoder.module.js')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const ambientLight = new THREE.AmbientLight(0xffffff, 1.75);
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth , window.innerHeight );
renderer.domElement.id = "satellite"
document.body.querySelector("header").appendChild(renderer.domElement)

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

let satellite
loader.load('/assets/neon-dawn/satellite.glb', function (gltf) {
    satellite = gltf.scene.children[0]
    scene.add(ambientLight);
    scene.add(satellite);
    
    camera.position.z = 5;
    satellite.position.set(4, -1.5, 0)
    satellite.scale.set(3, 3, 3)
}, undefined, console.error);

const mouse = new THREE.Vector2();
function onMouseMove(event) {
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