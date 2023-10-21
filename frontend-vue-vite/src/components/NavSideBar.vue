<!-- TODO
- overall size on the page
- bigger avatar and icons
- script link to database to show user info
-->

<script lang="ts">
import { usePlayerStore } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const { user } = storeToRefs(await usePlayerStore())

export default {
	data() {
		return {
			user: {
				username: user.value.username,
				firstName: user.value.firstName,
				familyName: user.value.lastName,
				avatar: user.value.avatar
			},
			styleSheetToggle : false,
		}
	},
	// mounted() {
	// 	if (this.styleSheetToggle) {
	// 	import('@/assets/debug.css').then(() => {
	// 		console.log('debug stylesheet loaded');
	// 	});
	// 	} else {
	// 	import('@/assets/main.css').then(() => {
	// 		console.log('main stylesheet loaded');
	// 	});
	// 	}
	// },
}
</script>

<template>
	<v-navigation-drawer expand-on-hover rail permanent class="NavSideBar">
		<v-list>
			<v-list-item
				:prepend-avatar="user.avatar"
				:title="user.firstName + ' ' + user.familyName"
				:subtitle="user.username"
				:to="{ name: 'profile' }"
			></v-list-item>
		</v-list>
		<v-divider></v-divider>
		<v-list class="navContent ">
			<v-list nav>
				<v-list-item
					:to="{ name: 'game' }"
					prepend-icon="mdi-controller"
					title="Play PONG !"
				></v-list-item>

				<v-list-item
					:to="{ name: 'chat' }"
					prepend-icon="mdi-chat"
					title="Community chat"
				></v-list-item>
			</v-list>
		</v-list>

		<v-list nav>
			<!-- <v-btn @click="styleSheetToggle = !styleSheetToggle"></v-btn> -->
			<v-list-item
				:to="{ name: 'home' }"
				prepend-icon="mdi-logout"
				title="Logout"
				class="logout"
				variant="tonal"
			></v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<style scoped>
.navContent {
	height: 80%;
}

</style>
