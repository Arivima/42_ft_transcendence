<script lang="ts">
import { usePlayerStore, PlayerStatus, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user } = storeToRefs(playerStore)
const debug = false

export default {
	data() {
		return {
			user : user
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
				console.error(err)
			}
		},
		getBadgeColor(status : PlayerStatus) : string {
			if (debug) console.log('| NavSideBar | methods | getBadgeColor()')
			if (status == PlayerStatus.online) return 'green'
			else if (status == PlayerStatus.playing) return 'blue'
			else return 'grey'			
		},
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
						:title="user.firstName"
						:subtitle="user.username"
						:to="{ name: 'profile' }"
						rounded
						class="ma-2 pa-2"
					>
						<template v-slot:prepend>
							<v-badge dot :color="getBadgeColor(user.status)">
								<v-avatar :image="user.avatar"></v-avatar>
							</v-badge>
						</template>
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
