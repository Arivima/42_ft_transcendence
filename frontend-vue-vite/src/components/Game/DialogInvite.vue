<script lang="ts">
import { defineComponent } from 'vue'
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { currentGame } = storeToRefs(playerStore)
const debug = true

export default defineComponent({
	data() {
		return {
			isCancelActive:  false,
		}
	},
	computed : {
		dialogBox() : boolean{
			console.log('| DialogInvite | computed | dialogBox : ' + currentGame.value.invite)
			return currentGame.value.invite
		},
		HostName() : string {
			console.log('| DialogInvite | computed | HostName : ' + currentGame.value.inviteSender)
			return currentGame.value.inviteSender
		},
	},
	methods: {
		accept(){
			console.log('| DialogInvite | methods | accept')
			playerStore.acceptInvitation();
			this.isCancelActive = true;
		},
		reject(){
			console.log('| DialogInvite | methods | reject')
			playerStore.rejectInvitation();
			this.isCancelActive = true;
		},
	},
	watch: {
		isCancelActive(newVal : boolean){
			console.log('| DialogInvite | watcher | isCancelActive : ' + newVal)
		},
		dialogBox(newVal : boolean){
			this.isCancelActive = false
			console.log('| DialogInvite | watcher | dialogBox : ' + newVal)
		}
	},

})
</script>

<template>
	<v-overlay
		:model-value="dialogBox"
		persistent
		class="align-center justify-center"
	>
		<v-card rounded class="dialog bg-white ma-auto pa-4">
			
			<v-card-title class="text-button text-"> {{ HostName }} has invited you to a game !</v-card-title>
			
			<v-card
				class="text-center ma-2"
				flat
				style="display: flex; flex-direction: row; justify-content: center;"
			>
				<v-btn
					text="Accept" @click="accept" :disabled="isCancelActive"
					border color="primary" variant="elevated" class="ma-2 pa-2"
				></v-btn>
				<v-btn
					text="Decline" @click="reject" :disabled="isCancelActive"
					border color="primary" variant="elevated" class="ma-2 pa-2"
				></v-btn>
			</v-card>

		</v-card>
	</v-overlay>
</template>
