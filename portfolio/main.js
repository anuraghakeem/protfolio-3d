import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import anurag from "./assets/anurag.png";
import moonImage from "./assets/moonImage.jpeg";
import space from "./assets/space.jpeg";
import normal from "./assets/normal.jpeg";
import backgroundMusic from "./assets/backgroundMusic.mp3";

var audio = new Audio(backgroundMusic);

const icon = document.querySelector("#audio-button > i");

const audioButton = document.querySelector("#audio-button");

function playBackgroundMusic() {
  console.log("clicked");
  if (audio.paused) {
    audio.play();
    icon.classList.remove("fa-volume-mute");
    icon.classList.add("fa-volume-up");
  } else {
    audio.pause();
    icon.classList.remove("fa-volume-up");
    icon.classList.add("fa-volume-mute");
  }
}

audioButton.onclick = playBackgroundMusic;

// playBackgroundMusic()

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load(space);
scene.background = spaceTexture;

// Avatar
const jeffTexture = new THREE.TextureLoader().load(anurag);
const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: jeffTexture })
);
scene.add(jeff);

// Moon
const moonTexture = new THREE.TextureLoader().load(moonImage);
const normalTexture = new THREE.TextureLoader().load(normal);
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.005;
  moon.rotation.y += 0.005;
  // moon.rotation.y += 0.075;
  moon.rotation.z += 0.005;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
