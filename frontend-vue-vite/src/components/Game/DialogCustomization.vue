<script lang="ts">
import { defineComponent } from 'vue'
import { usePlayerStore } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user, currentGame } = storeToRefs(playerStore)
const debug = true

export default defineComponent({
	data() {
		return {
			colorPaddle: currentGame.value.customizations.paddle_color,
			colorBall: currentGame.value.customizations.ball_color,
			colorPitch: currentGame.value.customizations.pitch_color,
		}
	},
	computed : {
		dialogBox(){
			console.log('| DialogCustomization | computed | dialogBox : ' + (currentGame.value.status == 'building' && currentGame.value.waiting == ''))
			return (currentGame.value.status == 'building' && currentGame.value.waiting == 'undefined')
		},
		opponentName() {
			console.log('| DialogCustomization | computed | opponentName : ' + (user.value.id == currentGame.value.gameInfo.hostID ? currentGame.value.guest.username : user.value.id == currentGame.value.gameInfo.guestID ? currentGame.value.host.username :'N/A'))
			return user.value.id == currentGame.value.gameInfo.hostID ?
				currentGame.value.guest.username :
			user.value.id == currentGame.value.gameInfo.guestID ?
				currentGame.value.host.username :
			'N/A';
		},
	},
	methods: {
		sendCustomization() {
			console.log('| DialogCustomization | methods | sendCustomization : ')
			playerStore.sendCustomizationOptions({
				pitch_color: this.colorPitch,
				paddle_color: this.colorPaddle,
				ball_color: this.colorBall,
			});
		},
	},
	watch: {
		dialogBox(isActive: boolean) {
			console.log('| DialogCustomization | watcher | dialogBox : ' + isActive)
			if (isActive == false){
				this.colorPaddle = currentGame.value.customizations.colorPaddle;
				this.colorBall = currentGame.value.customizations.colorBall;
				this.colorPitch = currentGame.value.customizations.colorPitch;				
			}
		},
	},
})
</script>

<template>
	<v-overlay
		:model-value="dialogBox"
		persistent
		class="align-center justify-center"
		min-width="1000"
	>
		<v-card rounded class="dialog bg-white ma-auto pa-4">
			
			<v-card-title class="text-button text-center">
				You are playing against {{ opponentName }}
			</v-card-title>
			<!-- <v-card-item
				class="justify-center ma-5 text-center"
			>
				<h5 class="text-h5">You are playing against</h5>
				<h5 class="text-h5">{{  opponentName }}</h5>
			</v-card-item> -->


			<v-card
				class="justify-center align-center"
				flat
			>	
				<v-card-item prepend-icon="mdi-brush">
					<v-card-subtitle class="text-overline">
						Customize your game
					</v-card-subtitle>
				</v-card-item>

				<v-card
					style="display: flex; flex-direction: row; justify-content: space-around;"
					flat
				>
					<v-card-item class="ma-1 pa-1">
						<p class="text-overline">Paddles</p>
						<v-color-picker width="130" :modes="['hexa']" hide-inputs v-model="colorPaddle"></v-color-picker>
						{{ colorPaddle }}
					</v-card-item>
					<v-card-item class="ma-1 pa-1">
						<p class="text-overline">Pitch</p>
						<v-color-picker  width="130" :modes="['hexa']" hide-inputs v-model="colorPitch"></v-color-picker>
						{{ colorPitch }}
					</v-card-item>
					<v-card-item  class="ma-1 pa-1">
						<p class="text-overline">Ball</p>
						<v-color-picker  width="130" :modes="['hexa']" hide-inputs v-model="colorBall"></v-color-picker>
						{{ colorBall }}
					</v-card-item>
				</v-card>
				<v-card-item class="w-100 justify-center">
					<v-btn text="Send preferences" @click="sendCustomization" border class="ma-4" color="primary" variant="tonal"></v-btn>
				</v-card-item>
			</v-card>
		</v-card>
	</v-overlay>
</template>
