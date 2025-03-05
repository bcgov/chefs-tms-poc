<template>
  <v-toolbar app flat elevation="0">
    <v-btn to="/tenancies" variant="text">Tenancies</v-btn>
    <v-btn to="/roles" variant="text">My Roles</v-btn>
  </v-toolbar>
</template>

<style scoped>
/* Ensure the Navbar is positioned correctly below the Header */
.v-toolbar {
  margin-top: 64px; /* Adjust this value to match the height of your Header */
}
</style>
