<!-- CHAT -->
<script setup lang="ts">
import NavSideBar from '../components/NavSideBar.vue'
import Chat from '@/components/Chat/Chat.vue'
import DialogWaiting from '@/components/Game/DialogWaiting.vue';
import DialogInvite from '@/components/Game/DialogInvite.vue';
import Notifications from '@/components/Notifications.vue';
</script>

<template>
    <div class="chat">
        <NavSideBar/>
        <Notifications></Notifications>
        <DialogWaiting></DialogWaiting>
        <DialogInvite></DialogInvite>
        <Chat/>
    </div>
</template>

<style scoped>
.chat {
	background-color: aqua;
	/* outline: solid; */
    width: 100%;
    height: 100%;
}
</style>