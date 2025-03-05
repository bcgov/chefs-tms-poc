<template>
  <!-- The Navbar for navigation -->
  <v-toolbar app flat elevation="0">
    <!-- Button to navigate to the Tenancies view -->
    <v-btn to="/tenancies" variant="text">Tenancies</v-btn>
    <!-- Button to navigate to the Roles view -->
    <v-btn to="/roles" variant="text">My Roles</v-btn>
  </v-toolbar>
</template>

<style scoped>
/* Ensure the Navbar is positioned correctly below the Header */
.v-toolbar {
  margin-top: 64px; /* Adjust this value to match the height of your Header */
}
</style>
