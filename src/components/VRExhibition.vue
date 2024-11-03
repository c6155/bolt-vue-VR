<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';
import { createExhibitionContent } from './ExhibitionContent';

const containerRef = ref<HTMLDivElement>();
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let isMovingForward = false;
let isMovingBackward = false;
let isMovingLeft = false;
let isMovingRight = false;
let isRotatingLeft = false;
let isRotatingRight = false;

const MOVE_SPEED = 0.1;
const ROTATION_SPEED = 0.02;

const init = () => {
  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  containerRef.value?.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 10, 0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 10, 0);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;
  spotLight.castShadow = true;
  scene.add(spotLight);

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x808080,
    roughness: 0.8,
    metalness: 0.2
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Create exhibition content
  createExhibitionContent(scene);

  // Initial camera position
  camera.position.set(0, 1.7, 5);
  camera.lookAt(0, 1.7, 0);
};

const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key.toLowerCase()) {
    case 'w': isMovingForward = true; break;
    case 's': isMovingBackward = true; break;
    case 'a': isMovingLeft = true; break;
    case 'd': isMovingRight = true; break;
    case 'q': isRotatingLeft = true; break;
    case 'e': isRotatingRight = true; break;
  }
};

const handleKeyUp = (event: KeyboardEvent) => {
  switch (event.key.toLowerCase()) {
    case 'w': isMovingForward = false; break;
    case 's': isMovingBackward = false; break;
    case 'a': isMovingLeft = false; break;
    case 'd': isMovingRight = false; break;
    case 'q': isRotatingLeft = false; break;
    case 'e': isRotatingRight = false; break;
  }
};

const animate = () => {
  requestAnimationFrame(animate);

  // Handle movement
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  const sideways = new THREE.Vector3(-direction.z, 0, direction.x);

  if (isMovingForward) camera.position.addScaledVector(direction, MOVE_SPEED);
  if (isMovingBackward) camera.position.addScaledVector(direction, -MOVE_SPEED);
  if (isMovingLeft) camera.position.addScaledVector(sideways, -MOVE_SPEED);
  if (isMovingRight) camera.position.addScaledVector(sideways, MOVE_SPEED);
  if (isRotatingLeft) camera.rotation.y += ROTATION_SPEED;
  if (isRotatingRight) camera.rotation.y -= ROTATION_SPEED;

  renderer.render(scene, camera);
};

const handleResize = () => {
  if (!containerRef.value) return;
  
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

onMounted(() => {
  init();
  animate();
  
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('resize', handleResize);
  
  renderer.dispose();
});
</script>

<template>
  <div ref="containerRef" class="vr-container"></div>
</template>

<style scoped>
.vr-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
</style>