<script lang="ts">
import { defineComponent } from 'vue'
import { usePlayerStore } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
import { IntersectingCirclesSpinner } from 'epic-spinners'
import {io, Socket} from 'socket.io-client'

// link to state of matchmaking

const playerStore = usePlayerStore()
const { user, fetchPlayer } = storeToRefs(playerStore)
const debug = true

export default defineComponent({
	components: {
		IntersectingCirclesSpinner,
	},
	emits : [
		'close',
		// 'ok'
	],
	data() {
		return {
			dialogBox: false,
			loading: false,
			foundOpponent : false, // to delete :  take from store & put into computed & in store initialise to false
			OpponentName : '',
			gameSocket: null as Socket | null,
		}
	},
	computed : {
		// foundOpponent(){
		// 	return store
		// },
	},
	methods: {
		cancelGameRequest(){
			this.dialogBox = false
			// send cancelation notification to server
			this.$emit("close");
		},
		sendOk(){
			this.dialogBox = false
			// send ok to start game to server
			// this.$emit("ok");
		},
	},
	watch: {
		dialogBox(isActive: boolean) {
			if (isActive == true) {
				this.loading = false
				this.foundOpponent = false
				this.OpponentName = ''

				this.gameSocket = io(`ws://${location.hostname}:${import.meta.env.VITE_BACKEND_PORT}/game`, {
							transports: ['websocket'],
							auth: {
								'token': user.value.token
							}
						}),

				this.gameSocket?.emit('matchMaking', {
					playerID: user.value.id,
				});

				this.gameSocket?.on('newGame', 
				async (game: {hostID : number, guestID : number}) => {
					let opponentID : number = (game.hostID == user.value.id)?
						game.guestID : game.hostID;
					this.OpponentName = (await fetchPlayer.value(opponentID)).username;
					this.foundOpponent = true;
				})
			} 
		},
	},
	mounted() {}
})
</script>

<template>
	<v-overlay
		v-model="dialogBox"
		activator="parent"
		class="align-center justify-center"
		min-width="500"
	>
		<v-card rounded class="dialog bg-white ma-auto pa-4 w-75">
			<v-card-title class="text-button text-center">
					{{ foundOpponent? 'Found player ! ': 'Waiting for your opponent' }}
			</v-card-title>
			<v-card-item
				class="justify-center ma-5"
				v-show="false == foundOpponent"
			>
				<intersecting-circles-spinner
					:animation-duration="1200"
					:size="70"
					color="purple"
					/>
			</v-card-item>
			<v-card-item
				class="justify-center ma-5 text-center"
				v-show="true == foundOpponent"
			>
				<h5 class="text-h5">You are playing against</h5>
				<h5 class="text-h5">{{  OpponentName }}</h5>
			</v-card-item>
			<v-card-item class="text-center ma-2">
				<v-btn v-show="false == foundOpponent" text="Cancel" @click="cancelGameRequest" border class="me-4" color="primary" variant="tonal"></v-btn>
				<v-btn v-show="true == foundOpponent" text="Ok" @click="sendOk" border class="me-4" color="primary" variant="tonal"></v-btn>
			</v-card-item>
		</v-card>
	</v-overlay>
</template>

<style scoped>

</style>