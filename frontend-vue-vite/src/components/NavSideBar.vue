<!-- TODO
- overall size on the page
-->

<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user } = storeToRefs(playerStore)
const debug = false

export default {
	data() {
		return {
		}
	},
	computed: {
		user() : Player {
		if (debug) console.log('| NavSideBar | computed | user(' + user.value.id + ')')
			return user.value
		},
		avatar() : string {
			if (debug) console.log('| NavSideBar | computed | avatar()')
			return user.value.avatar
		},
		// NEW
		username() : string {
			if (debug) console.log('| NavSideBar | computed | username(' + user.value.username + ')')
			return user.value.username
		}
	},
	methods : {
		async logOut() {
			if (debug) console.log('| NavSideBar | methods | logOut()')
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
	beforeCreate() {
		if (debug) console.log('| NavSideBar | beforeCreate()' )
	},
	created() {
		if (debug) console.log('| NavSideBar | created(' + (user.value.id) + ')')
	},
	beforeMount() {
		if (debug) console.log('| NavSideBar | beforeMount(' + (user.value.id) + ')')
	},
	mounted() {
		if (debug) console.log('| NavSideBar | mounted(' + (user.value.id) + ')')
	},
	beforeUpdate() {
		if (debug) console.log('| NavSideBar | beforeUpdate(' + (user.value.id) + ')')
	},
	updated() {
		if (debug) console.log('| NavSideBar | updated(' + (user.value.id) + ')')
	},
	beforeUnmount() {
		if (debug) console.log('| NavSideBar | beforeUnmount(' + (user.value.id) + ')')
	},
	unmounted() {
		if (debug) console.log('| NavSideBar | unmounted(' + (user.value.id) + ')')
	},
}
</script>

<template>
	<v-navigation-drawer
		expand-on-hover rail permanent class="NavSideBar rounded ma-2"
		>
		<v-card
			style="display: flex; flex-direction: column; height: inherit; background-color: transparent;"
			flat
		>
			<v-card
				style="background-color: transparent;"
				flat
			>
				<v-list>
					<v-list-item
						:prepend-avatar="avatar"
						:title="user.firstName"
						:subtitle="username"
						:to="{ name: 'profile' }"
						rounded
						class="ma-2 pa-2"
					>
					</v-list-item>
					<v-divider></v-divider>
					<v-list nav>
						<v-list-item
							:to="{ name: 'game' }"
							prepend-icon="mdi-controller"
							title="Play Cat PONG !"
						></v-list-item>

						<v-list-item
							:to="{ name: 'chat' }"
							prepend-icon="mdi-chat"
							title="Community chat"
						></v-list-item>
					</v-list>
				</v-list>
			</v-card>

			<v-card
				style="flex-grow: 1; background-color: transparent;"
				flat
			></v-card>
			<v-card
				flat
				style="background-color: transparent;"
			>
				<v-list nav style="justify-content: end;">
					<v-list-item
						@click="logOut"
						prepend-icon="mdi-logout"
						title="Logout"
						variant="tonal"
					></v-list-item>
					<v-list-item
						disabled
						prepend-icon="mdi-cat"
						title="Cazzendence 2023"
						variant="plain"
					></v-list-item>
				</v-list>			
			</v-card>
		</v-card>
	</v-navigation-drawer>
</template>
