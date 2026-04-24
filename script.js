import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 3000);
camera.position.set(0, 80, 200);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const orbit = new OrbitControls(camera, renderer.domElement);
let spaceshipMode = false;

// Stars 🌠
const starGeo = new THREE.BufferGeometry();
const starCount = 8000;
const pos = new Float32Array(starCount * 3);

for (let i = 0; i < pos.length; i++) {
  pos[i] = (Math.random() - 0.5) * 3000;
}

starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// Light
const light = new THREE.PointLight(0xffffff, 2, 3000);
scene.add(light);

// Loader
const loader = new THREE.TextureLoader();

// Sun
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(25, 64, 64),
  new THREE.MeshBasicMaterial({
    map: loader.load('https://threejsfundamentals.org/threejs/resources/images/sun.jpg')
  })
);
scene.add(sun);

// Planet Creator
function createPlanet(name, size, texture, dist, speed) {
  const geo = new THREE.SphereGeometry(size, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    map: loader.load(texture)
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.name = name;

  const pivot = new THREE.Object3D();
  mesh.position.x = dist;
  pivot.add(mesh);

  scene.add(pivot);

  return { mesh, pivot, speed };
}

// Planets
const planets = [
  createPlanet("Mercury", 3, 'https://threejsfundamentals.org/threejs/resources/images/planets/mercury.jpg', 40, 0.02),
  createPlanet("Venus", 5, 'https://threejsfundamentals.org/threejs/resources/images/planets/venus.jpg', 60, 0.015),
  createPlanet("Earth", 6, 'https://threejsfundamentals.org/threejs/resources/images/planets/earth.jpg', 80, 0.01),
  createPlanet("Mars", 4, 'https://threejsfundamentals.org/threejs/resources/images/planets/mars.jpg', 100, 0.008),
  createPlanet("Jupiter", 12, 'https://threejsfundamentals.org/threejs/resources/images/planets/jupiter.jpg', 140, 0.006),
  createPlanet("Saturn", 10, 'https://threejsfundamentals.org/threejs/resources/images/planets/saturn.jpg', 180, 0.005),
  createPlanet("Uranus", 8, 'https://threejsfundamentals.org/threejs/resources/images/planets/uranus.jpg', 220, 0.003),
  createPlanet("Neptune", 8, 'https://threejsfundamentals.org/threejs/resources/images/planets/neptune.jpg', 260, 0.002),
];

// Saturn ring
const ring = new THREE.Mesh(
  new THREE.RingGeometry(12, 20, 64),
  new THREE.MeshBasicMaterial({
    map: loader.load('https://threejsfundamentals.org/threejs/resources/images/saturnringcolor.jpg'),
    side: THREE.DoubleSide,
    transparent: true
  })
);
ring.rotation.x = Math.PI / 2;
planets[5].mesh.add(ring);

// Moon
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({
    map: loader.load('https://threejsfundamentals.org/threejs/resources/images/moon.jpg')
  })
);

const moonPivot = new THREE.Object3D();
moon.position.x = 10;
moonPivot.add(moon);
planets[2].mesh.add(moonPivot);

// Info popup
const infoBox = document.getElementById("info");

window.addEventListener("click", (e) => {
  const mouse = new THREE.Vector2(
    (e.clientX / innerWidth) * 2 - 1,
    -(e.clientY / innerHeight) * 2 + 1
  );

  const ray = new THREE.Raycaster();
  ray.setFromCamera(mouse, camera);

  const intersects = ray.intersectObjects(planets.map(p => p.mesh));

  if (intersects.length > 0) {
    const name = intersects[0].object.userData.name;
    infoBox.innerHTML = `<b>${name}</b><br>Beautiful planet in our solar system`;
    infoBox.classList.remove("hidden");
  }
});

// Toggle camera
document.getElementById("toggleCam").onclick = () => {
  spaceshipMode = !spaceshipMode;
};

// Keyboard movement
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Animate
function animate() {
  requestAnimationFrame(animate);

  // Orbit
  planets.forEach(p => {
    p.pivot.rotation.y += p.speed;
    p.mesh.rotation.y += 0.01;
  });

  moonPivot.rotation.y += 0.03;
  sun.rotation.y += 0.002;

  // Spaceship mode
  if (spaceshipMode) {
    orbit.enabled = false;

    if (keys['w']) camera.position.z -= 2;
    if (keys['s']) camera.position.z += 2;
    if (keys['a']) camera.position.x -= 2;
    if (keys['d']) camera.position.x += 2;
  } else {
    orbit.enabled = true;
  }

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
