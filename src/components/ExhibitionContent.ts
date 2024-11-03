import * as THREE from 'three';

export function createExhibitionContent(scene: THREE.Scene) {
  const textureLoader = new THREE.TextureLoader();

  // Create starry ceiling
  const ceilingGeometry = new THREE.PlaneGeometry(20, 20);
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0x000000,
    roughness: 0.9
  });
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.position.y = 5;
  ceiling.rotation.x = Math.PI / 2;
  scene.add(ceiling);

  // Add stars
  for (let i = 0; i < 200; i++) {
    const starGeometry = new THREE.SphereGeometry(0.02);
    const starMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.set(
      (Math.random() - 0.5) * 18,
      5,
      (Math.random() - 0.5) * 18
    );
    scene.add(star);
  }

  // Create curved wall
  const wallSegments = 20;
  const wallRadius = 7.5;
  const wallHeight = 4;
  const wallGeometry = new THREE.BufferGeometry();
  const vertices = [];
  const uvs = [];

  for (let i = 0; i <= wallSegments; i++) {
    const angle = (Math.PI / 2) * (i / wallSegments - 0.5);
    const x = Math.cos(angle) * wallRadius;
    const z = Math.sin(angle) * wallRadius;
    
    vertices.push(x, 0, z);
    vertices.push(x, wallHeight, z);
    
    uvs.push(i / wallSegments, 0);
    uvs.push(i / wallSegments, 1);
  }

  const indices = [];
  for (let i = 0; i < wallSegments; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, b, c);
    indices.push(b, d, c);
  }

  wallGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  wallGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  wallGeometry.setIndex(indices);
  wallGeometry.computeVertexNormals();

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1
  });
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  scene.add(wall);

  // Add display panels
  const panelGeometry = new THREE.PlaneGeometry(4, 2);
  
  // Timeline panel
  const timelineTexture = textureLoader.load('/timeline.jpg');
  const timelineMaterial = new THREE.MeshStandardMaterial({
    map: timelineTexture,
    roughness: 0.5,
    metalness: 0.1
  });
  const timelinePanel = new THREE.Mesh(panelGeometry, timelineMaterial);
  timelinePanel.position.set(3, 2, -7);
  timelinePanel.rotation.y = -Math.PI / 6;
  scene.add(timelinePanel);

  // Logo panel
  const logoTexture = textureLoader.load('/logo.jpg');
  const logoMaterial = new THREE.MeshStandardMaterial({
    map: logoTexture,
    roughness: 0.5,
    metalness: 0.1
  });
  const logoPanel = new THREE.Mesh(panelGeometry, logoMaterial);
  logoPanel.position.set(-3, 2, -7);
  logoPanel.rotation.y = Math.PI / 6;
  scene.add(logoPanel);

  // Floor with road markings
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorTexture = textureLoader.load('/floor.jpg');
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(1, 1);
  
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    map: floorTexture,
    roughness: 0.8,
    metalness: 0.2
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Add entrance arch
  const archGeometry = new THREE.TorusGeometry(2, 0.2, 16, 32, Math.PI);
  const archMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.3,
    metalness: 0.7
  });
  const arch = new THREE.Mesh(archGeometry, archMaterial);
  arch.position.set(0, 2, -7.5);
  arch.rotation.y = Math.PI / 2;
  scene.add(arch);

  // Add decorative lighting
  const spotLights = [];
  for (let i = 0; i < 5; i++) {
    const spotLight = new THREE.SpotLight(0xffffff, 2);
    const angle = (Math.PI / 6) * (i - 2);
    const radius = 7;
    spotLight.position.set(
      Math.cos(angle) * radius,
      4,
      Math.sin(angle) * radius
    );
    spotLight.target.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.2;
    spotLight.decay = 1.5;
    spotLight.distance = 10;
    spotLight.castShadow = true;
    scene.add(spotLight);
    scene.add(spotLight.target);
    spotLights.push(spotLight);
  }
}