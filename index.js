const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
import MouseMovement from 'mouse-movement';
import * as THREE from 'three';
// Import ThreeJS and assign it to global scope
// This way examples/ folder can use it too
global.THREE = THREE;

// Import any examples/ from ThreeJS
const mouseMovement = new MouseMovement('canvas');
let euler = new THREE.Euler( 2, 2, -4, 'YXZ' );
const boxes = [];
class Box {
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.initialPointX = this.x;
    this.z = z;
    let geometry = new THREE.BoxBufferGeometry(1,1,1);
    let material = new THREE.MeshBasicMaterial({color:0xff00ff});
    this.cube = new THREE.Mesh(geometry,material );
    this.cube.position.set(this.x, this.y, this.z);
  }
  getMesh(){
    return this.cube;
  }
  update(time){
    this.y = this.initialPointX + Math.sin(time);
    this.cube.position.set(this.x, this.y, this.z);
    
  }
}
class ControlledCamera {
  camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  constructor() {
    this.x = 2;
    this.y = 2;
    this.z = -4;
    this.camera.position.set(this.x, this.y, this.z);
    this.camera.lookAt(new THREE.Vector3());
  }
  getCamera() {
    return this.camera;
  }
  update() {
    // this.y += 0.002;
    this.camera.position.set(this.x, this.y, this.z);
  }
}
const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  // Turn on MSAA
  attributes: { antialias: true }
};
function mouseMovementCallback(cameraContoll){
    // console.log(mouseMovement.directionX);
    // console.log(mouseMovement.speedX);
    // console.log(mouseMovement.directionY);
    // console.log(mouseMovement.speedY);
    // console.log(mouseMovement.diagonal);
    // let curCamera =cameraContoll.getCamera();
    // euler.setFromQuaternion( curCamera.quaternion );

    // console.log({mouseMovement});
		// euler.y -=  mouseMovement.directionY* 0.000002;
		// euler.x -=  0.002;


  //289-298		// curCamera.quaternion.setFromEuler( euler );
}

function onMouseMove(e, cameraControll){
  let PI_2 = Math.PI/2;
  let camera = cameraControll.getCamera();
  let movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
	let movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
	euler.setFromQuaternion( camera.quaternion );
	euler.y -= movementX * 0.002;
	euler.x -= movementY * 0.002;
	euler.x = Math.max( PI_2 - Math.PI, Math.min( PI_2 - 0, euler.x ) );
	camera.quaternion.setFromEuler( euler );
}
 const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });
   // WebGL background color
  renderer.setClearColor("hsl(10, 60%, 70%)", 1);

  // Setup a camera
  const cameraContoll = new ControlledCamera();
  const camera = cameraContoll.getCamera();
  
  document.addEventListener('mousemove', (e)=>onMouseMove(e,cameraContoll));

   
  // Setup your scene
  const scene = new THREE.Scene();
  // Create a bunch of 'particles' in a group for the BG

  // Add a little mesh to the centre of the screen
  const mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.25, 0),
    new THREE.MeshBasicMaterial({
      color: "hsl(12%, 0%, 15%)",
      wireframe: true
    })
  );
  const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 'red' });
  const box = new THREE.Mesh(geometry, material);
  box.position.set(0, 0, 0)
  for( let i =0; i< 10; i++){
    let block = new Box(10*Math.random(),0, 10*Math.random());
    boxes.push(block);
    scene.add(block.getMesh())
  }
  // scene.add(box);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // And render events here
    render({ time, deltaTime }) {
      // Rotate background subtly
      //   controls.update();
      cameraContoll.update();
      boxes.forEach((b)=>{
        b.update(time);
      })
      renderer.render(scene, camera);
    },
    // Dispose of WebGL context (optional)
    unload() {
      //   controls.dispose();
      renderer.dispose();
    }
  };

};

canvasSketch(sketch, settings);
