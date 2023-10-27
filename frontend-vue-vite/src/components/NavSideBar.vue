<!-- TODO
- overall size on the page
- bigger avatar and icons
- script link to database to show user info
-->

<script lang="ts">
import { usePlayerStore } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = await usePlayerStore()
const { user } = storeToRefs(playerStore)

export default {
	data() {
		return {
			user: {
				username: user.value.username,
				firstName: user.value.firstName,
				familyName: user.value.lastName,
				avatar: user.value.avatar,
			},
		}
	},
	methods : {
		async logOut() {
			try {
				await playerStore.logout()
				this.$router.go(0)
			}
			catch(err) {
				//TODO TOAST ERROR
				console.log(err)
			}
		}
	},
	async mounted() {

	},
}
</script>

<template>
	<v-navigation-drawer expand-on-hover rail permanent class="NavSideBar rounded ma-2">
		<v-list>
			<v-list-item
				:prepend-avatar="user.avatar"
				:title="user.firstName"
				:subtitle="user.username"
				:to="{ name: 'profile' }"
				rounded
				class="mx-2 px-2"
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
			
			<v-list-item
				@click="logOut"
				prepend-icon="mdi-logout"
				title="Logout"
				class="logout"
				variant="tonal"
			></v-list-item>
			<v-list-item
				disabled
				prepend-icon="mdi-cat"
				title="Cazzendence 2023"
				variant="plain"
			></v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<style scoped>
.navContent {
	height: 70%;
}

</style>
