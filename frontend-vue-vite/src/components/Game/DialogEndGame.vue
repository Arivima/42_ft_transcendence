<script lang="ts">
import { defineComponent } from 'vue'
import { usePlayerStore } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user, currentGame } = storeToRefs(playerStore)
const debug = true

export default defineComponent({
	computed : {
		dialogBox(){
			console.log('| DialogEnd | computed | dialogBox : ' + (currentGame.value.status == 'end'))
			return (currentGame.value.status == 'end')
		},
		title() : string {
			console.log('| DialogEnd | computed | title')
			switch(currentGame.value.endReason){
					case 'hostWin'	: (this.userIsHost == true ? 'You have won !' : 'You have lost ...')
					case 'guestWin'	: (this.userIsGuest == true ? 'You have won !' : 'You have lost ...')
					case 'userLeft'	: return 'You have left the game'
					case 'aPlayerLeft': return 'A player left the game'
					case 'opponentLeft'		: return 'Your opponent left the game'
					default: // if 'undefined'
					return ''
				}
		},
		someoneWon() : boolean {
			console.log('| DialogEnd | computed | someoneWon : ' + (currentGame.value.endReason == 'hostWin' || currentGame.value.endReason == 'guestWin'))
			return (currentGame.value.endReason == 'hostWin' || currentGame.value.endReason == 'guestWin')
		},
		userIsHost() : boolean {
			console.log('| DialogEnd | computed | userIsHost : ' + (currentGame.value.host.id == user.value.id))
			return (currentGame.value.host.id == user.value.id)
		},
		userIsGuest() : boolean {
			console.log('| DialogEnd | computed | userIsGuest : ' + (currentGame.value.guest.id == user.value.id))
			return (currentGame.value.guest.id == user.value.id)
		},
		score() : { host : number, guest : number} {
			console.log('| DialogEnd | computed | score : ' + currentGame.value.finalScore.host + ' | ' +  currentGame.value.finalScore.guest)
			return currentGame.value.finalScore.host, currentGame.value.finalScore.guest
		},
		hostName() : string {
			console.log('| DialogEnd | computed | hostName : ' + currentGame.value.host.username)
			return currentGame.value.host.username
		},
		guestName() : string {
			console.log('| DialogEnd | computed | guestName : ' + currentGame.value.guest.username)
			return currentGame.value.guest.username
		},
	},
	methods: {
		exit(){
			console.log('| DialogEnd | methods | exit')
			playerStore.resetGame()
		},
	},
})
</script>

<template>
	<v-overlay
		:model-value="dialogBox"
		persistent
		class="align-center justify-center"
	>
		<v-card
			rounded
			class="dialog bg-white ma-auto pa-4"
		>
			<v-card-title class="text-button text-center">{{ title }}</v-card-title>

			<v-card
				v-if="someoneWon"
				class="justify-center ma-5">
				<v-card-item title="Host">
					<p>{{ hostName}}</p>
					<p>{{ score.host }}</p>
				</v-card-item>
				<v-card-item title="Guest">
					<p>{{ guestName}}</p>
					<p>{{ score.guest }}</p>
				</v-card-item>
			</v-card>

			<v-card-item class="text-center ma-2">
				<v-btn
					text="Exit"
					@click="exit"
					size="large"
					color="primary"
					variant="tonal"
				></v-btn>
			</v-card-item>
		</v-card>
	</v-overlay>
</template>
