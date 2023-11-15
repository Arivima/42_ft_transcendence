<script lang="ts">
import { defineComponent } from 'vue'
import { usePlayerStore } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
import { IntersectingCirclesSpinner } from 'epic-spinners'

// link to state of matchmaking

const playerStore = usePlayerStore()
const { user } = storeToRefs(playerStore)
const debug = true

export default defineComponent({
	components: {
		IntersectingCirclesSpinner,
	},
	data() {
		return {
			dialogBox: false,
			loading: false,
			foundOpponent : false, // to delete :  take from store & put into computed & in store initialise to false
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
		},
	},
	watch: {
		dialogBox(isActive: boolean) {
			if (isActive == true) {
				
				// to delete : here to reproduce a queue effect while no connection with store
				setTimeout(() => {
					this.foundOpponent = true
				}, 3000)
			} 
		},
		foundOpponent(newVal : Boolean){
			if (newVal == true) {
				this.dialogBox = false
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
			<v-card-title class="text-button text-center">Waiting for your opponent</v-card-title>
			<v-card-item class="justify-center ma-5">
				<intersecting-circles-spinner
								:animation-duration="1200"
								:size="70"
								color="purple"
								/>
			</v-card-item>
			<v-card-item class="text-center ma-2">
				<v-btn text="Cancel" @click="cancelGameRequest" border class="me-4" color="primary" variant="tonal"></v-btn>
			</v-card-item>
		</v-card>
	</v-overlay>
</template>

<style scoped>

</style>