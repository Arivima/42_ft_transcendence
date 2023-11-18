<script lang="ts">
import { defineComponent } from 'vue'
import { usePlayerStore } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
import { IntersectingCirclesSpinner } from 'epic-spinners'
import {io, Socket} from 'socket.io-client'
import Customization from './Customization.vue'
import { onUnmounted } from 'vue'

// link to state of matchmaking

const playerStore = usePlayerStore()
const { user, currentGame, fetchPlayer } = storeToRefs(playerStore)
const debug = true

export default defineComponent({
	components: {
    IntersectingCirclesSpinner,
    Customization
},
	emits : [
		'close',
		// 'ok'
	],
	data() {
		return {
			dialogBox: false,
			loading: false,
			// foundOpponent : false, // to delete :  take from store & put into computed & in store initialise to false
			// opponentName : '',
			gameSocket: {} as any,
		}
	},
	computed : {
		opponentName() {
			return user.value.id == currentGame.value.gameInfo.hostID ?
				currentGame.value.gameInfo.guestName :
			user.value.id == currentGame.value.gameInfo.guestID ?
				currentGame.value.gameInfo.hostName :
			'N/A';
		},
		foundOpponent() {
			return user.value.id == currentGame.value.gameInfo.hostID ?
				undefined != currentGame.value.gameInfo.guestID :
				undefined != currentGame.value.gameInfo.hostID;
		}
		// foundOpponent(){
		// 	return store
		// },
	},
	methods: {
		cancelGameRequest(){
			this.gameSocket.close();
			this.gameSocket = {};
			if (JSON.stringify({}) == JSON.stringify(this.gameSocket))
				console.log(`request canceled successfully`)
			this.dialogBox = false;
			// if (debug) console.log('cancelGameRequest')
			// this.dialogBox = false
			// // send cancelation notification to server
			// this.$emit("close");
		},
		sendOk(){
			if (debug) console.log('sendOk')
			this.dialogBox = false
			//! until un-implemented
			this.cancelGameRequest();
			// send ok to start game to server
			// this.$emit("ok");
		},
	},
	watch: {
		dialogBox(isActive: boolean) {
			if (debug) console.log('watchers | dialogBox : ' + isActive)
			if (isActive == true) {
				this.loading = false
				this.foundOpponent = false
				this.opponentName = ''

				// console.log(`gameSocket: ${JSON.stringify(this.gameSocket)}`);
				// if (JSON.stringify({}) == JSON.stringify(this.gameSocket))
				// {
					// console.log(`DialogQueue gameSocket SET`);
					// this.gameSocket = io(
					// 	`ws://${location.hostname}:${import.meta.env.VITE_BACKEND_PORT}/game`,
					// 	{
					// 		transports: ['websocket'],
					// 		auth: {'token': user.value.token}
					// 	}
					// ),
	
					// this.gameSocket.on('newGame', 
					// async (game: {hostID : number, guestID : number}) => {
					// 	if (debug) console.log('receive : newGame')
						
					// 	let opponentID : number = (game.hostID == user.value.id)?
					// 		game.guestID : game.hostID;
					// 	if (debug) console.log('opponentID : ' + opponentID)
						
					// 	this.opponentName = (await fetchPlayer.value(opponentID)).username;
					// 	if (debug) console.log('opponentName : ' + this.opponentName)
						
					// 	this.foundOpponent = true;
					// 	if (debug) console.log('foundOpponent : ' + this.foundOpponent)
					// })
				// }
				// console.log(`PORCO DIO`);
				playerStore.sendMatchMakingRequest();
				// this.gameSocket.emit('matchMaking', {
				// 	playerID: user.value.id,
				// });
				// if (debug) console.log('emit : matchMaking')
			}
		},
	},
	mounted() {},
	unmounted() {
		// this.gameSocket.disconnect();
		// this.gameSocket = {};
		// if (JSON.stringify({}) == JSON.stringify(this.gameSocket))
		// 	console.log(`component successfully unmounted`);
		// else
		// 	console.log(`component unmount FAIL`);
	}
})
</script>

<template>
	<v-overlay
		v-model="dialogBox"
		activator="parent"
		persistent
		class="align-center justify-center"
		min-width="1000"
	>
		<v-card rounded class="dialog bg-white ma-auto pa-4">
			
			<v-card-title class="text-button text-center">
					{{ foundOpponent? 'Found player ! ': 'Waiting for your opponent' }}
			</v-card-title>
			
			<v-card-item
				v-show="false == foundOpponent"
				class="justify-center ma-5"
			>
				<intersecting-circles-spinner
					:animation-duration="1200"
					:size="70"
					color="purple"
					/>
			</v-card-item>
			
			<v-card-item
				v-show="true == foundOpponent"
				class="justify-center ma-5 text-center"
			>
				<h5 class="text-h5">You are playing against</h5>
				<h5 class="text-h5">{{  opponentName? opponentName : 'error' }}</h5>
			</v-card-item>


			<Customization
				v-show="true == foundOpponent"
			></Customization>


			<v-card-item class="text-center ma-2">
				<v-btn v-show="false == foundOpponent" text="Cancel" @click="cancelGameRequest" border class="me-4" color="primary" variant="tonal"></v-btn>
			</v-card-item>

		</v-card>
	</v-overlay>
</template>

<style scoped>

</style>