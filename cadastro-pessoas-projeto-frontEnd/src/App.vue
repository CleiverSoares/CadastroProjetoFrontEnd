
<template>
  <div class="main-container">
    <Router-view />
  </div>
</template>
<script>

export default {
    name: 'App',
}
</script>
<style>
* {
  padding: 0;
  margin: 0 auto;
  box-sizing: border-box;
  
}
#app{
  background-color: var(--c-app-bg);
}

.main-container {
  flex: 1;
  min-height: 100vh;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
}
</style>
