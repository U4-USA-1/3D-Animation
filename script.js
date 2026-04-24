console.log("Solar System Running 🚀");

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 3000);
camera.position.set(0, 100, 250);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const orbit = new THREE.OrbitControls(camera, renderer.domElement);
let spaceship = false;

// Light
const light = new THREE.PointLight(0xffffff, 2);
scene.add(light);

// Texture base (STABLE)
const base = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/";
const loader = new THREE.TextureLoader();

// Sun
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(30, 64, 64),
  new THREE.MeshBasicMaterial({ map: loader.load(base + "sun.jpg") })
);
scene.add(sun);

// Planet creator
function createPlanet(name, size, texture, distance, speed) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(size, 32, 32),
    new THREE.MeshStandardMaterial({ map: loader.load(base + texture) })
  );

  mesh.userData.name = name;

  const pivot = new THREE.Object3D();
  mesh.position.x = distance;
  pivot.add(mesh);
  scene.add(pivot);

  return { mesh, pivot, speed };
}

// Planets
const planets = [
  createPlanet("Mercury", 3, "mercury.jpg", 50, 0.02),
  createPlanet("Venus", 5, "venus.jpg", 70, 0.015),
  createPlanet("Earth", 6, "earth_atmos_2048.jpg", 90, 0.01),
  createPlanet("Mars", 4, "mars_1k_color.jpg", 110, 0.008),
  createPlanet("Jupiter", 12, "jupiter2_1024.jpg", 150, 0.006),
  createPlanet("Saturn", 10, "saturn.jpg", 190, 0.005),
  createPlanet("Uranus", 8, "uranus.jpg", 230, 0.003),
  createPlanet("Neptune", 8, "neptune.jpg", 270, 0.002),
];

// Moon
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({ map: loader.load(base + "moon_1024.jpg") })
);

const moonPivot = new THREE.Object3D();
moon.position.x = 12;
moonPivot.add(moon);
planets[2].mesh.add(moonPivot);

// Saturn ring
const ring = new THREE.Mesh(
  new THREE.RingGeometry(12, 20, 64),
  new THREE.MeshBasicMaterial({
    map: loader.load(base + "saturnringcolor.jpg"),
    side: THREE.DoubleSide,
    transparent: true
  })
);
ring.rotation.x = Math.PI / 2;
planets[5].mesh.add(ring);

// UI
const info = document.getElementById("info");
const label = document.getElementById("label");

// Hover label
window.addEventListener("mousemove", e => {
  const mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );

  const ray = new THREE.Raycaster();
  ray.setFromCamera(mouse, camera);

  const hit = ray.intersectObjects(planets.map(p => p.mesh));

  if (hit.length) {
    label.innerText = hit[0].object.userData.name;
    label.style.left = e.clientX + "px";
    label.style.top = e.clientY + "px";
    label.classList.remove("hidden");
  } else {
    label.classList.add("hidden");
  }
});

// Click info
window.addEventListener("click", e => {
  const mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );

  const ray = new THREE.Raycaster();
  ray.setFromCamera(mouse, camera);

  const hit = ray.intersectObjects(planets.map(p => p.mesh));

  if (hit.length) {
    const name = hit[0].object.userData.name;
    info.innerHTML = `<b>${name}</b><br>Planet in solar system`;
    info.classList.remove("hidden");
  }
});

// Toggle camera
document.getElementById("toggleCam").onclick = () => {
  spaceship = !spaceship;
};

// Movement
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Sound
const audio = document.getElementById("spaceSound");
window.addEventListener("click", () => audio.play(), { once: true });

// Animation
function animate() {
  requestAnimationFrame(animate);

  planets.forEach(p => {
    p.pivot.rotation.y += p.speed;
    p.mesh.rotation.y += 0.01;
  });

  moonPivot.rotation.y += 0.03;
  sun.rotation.y += 0.002;

  if (spaceship) {
    orbit.enabled = false;

    if (keys["w"]) camera.position.z -= 2;
    if (keys["s"]) camera.position.z += 2;
    if (keys["a"]) camera.position.x -= 2;
    if (keys["d"]) camera.position.x += 2;
  } else {
    orbit.enabled = true;
  }

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
