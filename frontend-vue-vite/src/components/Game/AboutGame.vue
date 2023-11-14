<script lang="ts">
import { defineComponent } from 'vue'

// overlay with dialog box how to play + pause game

export default defineComponent({
	components: {
	},
	data() {
		return {
			overlay : false,
			isGamePaused: false,
		}
	},
	watch : {
		overlay(newVal : Boolean){
			if (newVal == true)
				this.isGamePaused = true
			if (newVal == true)
			this.isGamePaused = false
		}
	}
})
</script>

<template>
	<v-app-bar
		floating
		location="bottom"
		class="mx-2 my-2"
		style="background-color: transparent;"
		flat
	>
		<template v-slot:append>
			<v-card	class="d-flex pa-3 justify-end align-start" color="transparent" flat>
				<v-btn
					icon="mdi-help"
					class="ma-0 pa-0 justify-center align-center NavSideBar"
					style="background-color: white;"
					@click="overlay = true"
				>

				</v-btn>				
				<v-overlay
					v-model="overlay"
					class="align-center justify-center"
				>
					<v-card
						class="pa-3 ma-3"
						>
						<v-card-title>How to play the game</v-card-title>
						<v-card-item>
							<v-card-text>blabla</v-card-text>
						</v-card-item>
					</v-card>
				</v-overlay>					
			</v-card>
		</template>
	</v-app-bar>
</template>

<style scoped>

</style>				