<!-- TODO
- overall size on the page
-->

<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user, currentGame } = storeToRefs(playerStore)
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
		},
		waiting() : 'undefined'  | 'matchmaking' | 'invite' | 'streaming' | 'customization' | 'playing' {
			return currentGame.value.waiting
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
		},
		update(value : 'undefined'  | 'matchmaking' | 'invite' | 'streaming' | 'customization' | 'playing'){
			playerStore.updateWaitingTesting(value)
		}
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

			<v-card style="display: flex; flex-direction: column; background-color: aquamarine;" class="ma-2 pa-2">
				<p>TESTING DIALOG BOX</p>
				<p>current value : </p>
				<p>waiting = {{ waiting }}</p>
				<v-btn @click="update('undefined')">undefined</v-btn>
				<v-btn @click="update('matchmaking')">matchmaking</v-btn>
				<v-btn @click="update('invite')">invite</v-btn>
				<v-btn @click="update('streaming')">streaming</v-btn>
				<v-btn @click="update('customization')">customization</v-btn>
				<v-btn @click="update('playing')">playing</v-btn>
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
