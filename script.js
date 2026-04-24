import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);
camera.position.set(0, 50, 150);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls (zoom + rotate)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

// Stars 🌠
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 5000;
const positions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 2000;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Texture loader
const loader = new THREE.TextureLoader();

// Sun ☀️
const sunGeo = new THREE.SphereGeometry(20, 64, 64);
const sunMat = new THREE.MeshBasicMaterial({
  map: loader.load('https://threejsfundamentals.org/threejs/resources/images/sun.jpg')
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Light
const light = new THREE.PointLight(0xffffff, 2, 2000);
scene.add(light);

// Planet function
function createPlanet(size, texture, distance) {
  const geo = new THREE.SphereGeometry(size, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    map: loader.load(texture)
  });

  const mesh = new THREE.Mesh(geo, mat);

  const obj = new THREE.Object3D();
  obj.add(mesh);
  mesh.position.x = distance;

  scene.add(obj);

  return { mesh, obj };
}

// Planets
const mercury = createPlanet(3, 'https://threejsfundamentals.org/threejs/resources/images/planets/mercury.jpg', 30);
const venus = createPlanet(5, 'https://threejsfundamentals.org/threejs/resources/images/planets/venus.jpg', 45);
const earth = createPlanet(6, 'https://threejsfundamentals.org/threejs/resources/images/planets/earth.jpg', 60);
const mars = createPlanet(4, 'https://threejsfundamentals.org/threejs/resources/images/planets/mars.jpg', 75);
const jupiter = createPlanet(12, 'https://threejsfundamentals.org/threejs/resources/images/planets/jupiter.jpg', 100);
const saturn = createPlanet(10, 'https://threejsfundamentals.org/threejs/resources/images/planets/saturn.jpg', 130);
const uranus = createPlanet(8, 'https://threejsfundamentals.org/threejs/resources/images/planets/uranus.jpg', 160);
const neptune = createPlanet(8, 'https://threejsfundamentals.org/threejs/resources/images/planets/neptune.jpg', 190);

// Moon 🌙
const moonGeo = new THREE.SphereGeometry(2, 32, 32);
const moonMat = new THREE.MeshStandardMaterial({
  map: loader.load('https://threejsfundamentals.org/threejs/resources/images/moon.jpg')
});
const moon = new THREE.Mesh(moonGeo, moonMat);

const moonObj = new THREE.Object3D();
moon.position.x = 10;
moonObj.add(moon);
earth.mesh.add(moonObj);

// Saturn Ring 🪐
const ringGeo = new THREE.RingGeometry(12, 18, 64);
const ringMat = new THREE.MeshBasicMaterial({
  map: loader.load('https://threejsfundamentals.org/threejs/resources/images/saturnringcolor.jpg'),
  side: THREE.DoubleSide,
  transparent: true
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2;
saturn.mesh.add(ring);

// Animation
function animate() {
  requestAnimationFrame(animate);

  // Self rotation
  sun.rotation.y += 0.002;
  mercury.mesh.rotation.y += 0.01;
  venus.mesh.rotation.y += 0.008;
  earth.mesh.rotation.y += 0.02;
  mars.mesh.rotation.y += 0.018;
  jupiter.mesh.rotation.y += 0.04;
  saturn.mesh.rotation.y += 0.03;

  // Orbit rotation
  mercury.obj.rotation.y += 0.02;
  venus.obj.rotation.y += 0.015;
  earth.obj.rotation.y += 0.01;
  mars.obj.rotation.y += 0.008;
  jupiter.obj.rotation.y += 0.006;
  saturn.obj.rotation.y += 0.005;
  uranus.obj.rotation.y += 0.003;
  neptune.obj.rotation.y += 0.002;

  // Moon orbit
  moonObj.rotation.y += 0.03;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
