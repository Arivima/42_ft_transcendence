<script lang="ts">
import { defineComponent } from 'vue'
import { usePlayerStore } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

// link to state of matchmaking

const playerStore = usePlayerStore()
const { user } = storeToRefs(playerStore)
const debug = true

export default defineComponent({
	components: {
	},
	data() {
		return {
			dialogBox: false,
			loading: false,
		}
	},
	methods: {
		backToGameHome(){
			this.dialogBox = false
		},
	},
	watch: {
		dialogBox(isActive: boolean) {
			if (isActive == true) {
			} 
		}
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
			<v-card-title class="text-button text-center">End of match !</v-card-title>
			<v-card-item class="justify-center ma-5">
				<p>You won ! || You lost !</p>
				<p>Scores Host : xx | Score guest : xx</p>
			</v-card-item>
			<v-card-item class="text-center ma-2">
				<v-btn
					text="Exit"
					@click="backToGameHome"
					border
					class="me-4"
					color="primary"
					variant="tonal"
				></v-btn>
			</v-card-item>
		</v-card>
	</v-overlay>
</template>

<style scoped>

</style>