import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Galaxy Background 🌌
const cubeLoader = new THREE.CubeTextureLoader();
scene.background = cubeLoader.load([
  'https://threejs.org/examples/textures/cube/space/px.jpg',
  'https://threejs.org/examples/textures/cube/space/nx.jpg',
  'https://threejs.org/examples/textures/cube/space/py.jpg',
  'https://threejs.org/examples/textures/cube/space/ny.jpg',
  'https://threejs.org/examples/textures/cube/space/pz.jpg',
  'https://threejs.org/examples/textures/cube/space/nz.jpg'
]);

// Camera
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 4000);
camera.position.set(0, 100, 250);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const orbit = new OrbitControls(camera, renderer.domElement);
let spaceshipMode = false;

// Light
const light = new THREE.PointLight(0xffffff, 2, 4000);
scene.add(light);

// Loader
const loader = new THREE.TextureLoader();

// Sun ☀️
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(30, 64, 64),
  new THREE.MeshBasicMaterial({
    map: loader.load('https://threejsfundamentals.org/threejs/resources/images/sun.jpg')
  })
);
scene.add(sun);

// Planet data 🛰️
const planetData = {
  Mercury: "Distance: 57M km",
  Venus: "Distance: 108M km",
  Earth: "Distance: 150M km",
  Mars: "Distance: 228M km",
  Jupiter: "Distance: 778M km",
  Saturn: "Distance: 1.4B km",
  Uranus: "Distance: 2.9B km",
  Neptune: "Distance: 4.5B km"
};

// Planet creator
function createPlanet(name, size, texture, dist, speed) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(size, 32, 32),
    new THREE.MeshStandardMaterial({
      map: loader.load(texture)
    })
  );

  mesh.userData.name = name;

  const pivot = new THREE.Object3D();
  mesh.position.x = dist;
  pivot.add(mesh);
  scene.add(pivot);

  return { mesh, pivot, speed };
}

// Planets
const planets = [
  createPlanet("Mercury", 3, 'https://threejsfundamentals.org/threejs/resources/images/planets/mercury.jpg', 50, 0.02),
  createPlanet("Venus", 5, 'https://threejsfundamentals.org/threejs/resources/images/planets/venus.jpg', 70, 0.015),
  createPlanet("Earth", 6, 'https://threejsfundamentals.org/threejs/resources/images/planets/earth.jpg', 90, 0.01),
  createPlanet("Mars", 4, 'https://threejsfundamentals.org/threejs/resources/images/planets/mars.jpg', 110, 0.008),
  createPlanet("Jupiter", 12, 'https://threejsfundamentals.org/threejs/resources/images/planets/jupiter.jpg', 150, 0.006),
  createPlanet("Saturn", 10, 'https://threejsfundamentals.org/threejs/resources/images/planets/saturn.jpg', 190, 0.005),
  createPlanet("Uranus", 8, 'https://threejsfundamentals.org/threejs/resources/images/planets/uranus.jpg', 230, 0.003),
  createPlanet("Neptune", 8, 'https://threejsfundamentals.org/threejs/resources/images/planets/neptune.jpg', 270, 0.002)
];

// Saturn ring 🪐
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

// Moon 🌙
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({
    map: loader.load('https://threejsfundamentals.org/threejs/resources/images/moon.jpg')
  })
);

const moonPivot = new THREE.Object3D();
moon.position.x = 12;
moonPivot.add(moon);
planets[2].mesh.add(moonPivot);

// UI elements
const infoBox = document.getElementById("info");
const label = document.getElementById("label");

// Hover labels 🏷️
window.addEventListener("mousemove", (e) => {
  const mouse = new THREE.Vector2(
    (e.clientX / innerWidth) * 2 - 1,
    -(e.clientY / innerHeight) * 2 + 1
  );

  const ray = new THREE.Raycaster();
  ray.setFromCamera(mouse, camera);

  const hit = ray.intersectObjects(planets.map(p => p.mesh));

  if (hit.length) {
    const name = hit[0].object.userData.name;
    label.innerText = name;
    label.style.left = e.clientX + 10 + "px";
    label.style.top = e.clientY + 10 + "px";
    label.classList.remove("hidden");
  } else {
    label.classList.add("hidden");
  }
});

// Click info 🎮
window.addEventListener("click", (e) => {
  const mouse = new THREE.Vector2(
    (e.clientX / innerWidth) * 2 - 1,
    -(e.clientY / innerHeight) * 2 + 1
  );

  const ray = new THREE.Raycaster();
  ray.setFromCamera(mouse, camera);

  const hit = ray.intersectObjects(planets.map(p => p.mesh));

  if (hit.length) {
    const name = hit[0].object.userData.name;
    infoBox.innerHTML = `<b>${name}</b><br>${planetData[name]}`;
    infoBox.classList.remove("hidden");
  }
});

// Toggle camera 🚀
document.getElementById("toggleCam").onclick = () => {
  spaceshipMode = !spaceshipMode;
};

// Keyboard
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Sound 🔊
const audio = document.getElementById("spaceSound");
window.addEventListener("click", () => audio.play(), { once: true });

// Animate
function animate() {
  requestAnimationFrame(animate);

  planets.forEach(p => {
    p.pivot.rotation.y += p.speed;
    p.mesh.rotation.y += 0.01;
  });

  moonPivot.rotation.y += 0.03;
  sun.rotation.y += 0.002;

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
