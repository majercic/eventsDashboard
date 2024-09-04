<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">EVENT7 Dashboard</a>
      <div class="d-flex">
        <h4 class="navbar-text">Office: {{ $globalState.country }}</h4>
        
        </div>
    </div>
  </nav>
</template>


<script>

export default {
  name: 'AppHeader',

};
</script>
