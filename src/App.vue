<script setup lang="ts">
import VRExhibition from './components/VRExhibition.vue'
</script>

<template>
  <VRExhibition />
  <div class="controls-info">
    <h2>Controls</h2>
    <ul>
      <li>W - Move forward</li>
      <li>S - Move backward</li>
      <li>A - Move left</li>
      <li>D - Move right</li>
      <li>Q - Rotate left</li>
      <li>E - Rotate right</li>
    </ul>
  </div>
</template>

<style>
body {
  margin: 0;
  overflow: hidden;
}

.controls-info {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  z-index: 1000;
}

.controls-info h2 {
  margin: 0 0 10px 0;
  font-size: 1.2em;
}

.controls-info ul {
  margin: 0;
  padding: 0 0 0 20px;
  list-style-type: none;
}

.controls-info li {
  margin: 5px 0;
  font-size: 0.9em;
}
</style>