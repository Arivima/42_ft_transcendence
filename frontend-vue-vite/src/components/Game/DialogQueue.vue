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
				
				// to delete : here to reproduce a queue effect while no connection with store
				setTimeout(() => {
					this.foundOpponent = true
					this.OpponentName = 'My Opponent'
				}, 3000)

			} 
		},
		// foundOpponent(newVal : Boolean){
		// 	if (newVal == true) {
		// 	}
		// },
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