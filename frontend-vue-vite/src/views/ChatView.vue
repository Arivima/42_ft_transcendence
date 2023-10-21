<!-- CHAT -->
<script setup lang="ts">
import NavSideBar from '../components/NavSideBar.vue'
</script>

<template>
    <div class="chat">
        <NavSideBar/>
        <v-navigation-drawer permanent>
        <v-list>
          <v-list-item title="channels" value="channels"></v-list-item>

          <v-list-item title="direct messaging" value="contacts"></v-list-item>

          <v-list-item title="Settings" value="settings"></v-list-item>
        </v-list>
      </v-navigation-drawer>
            <h1>This is Chat</h1>
        
        <v-main>
        </v-main>
    </div>
</template>

<style scoped>
.chat {
	background-color: aqua;
	outline: solid;
}
</style>