<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user } = storeToRefs(playerStore)

const debug = false

export default {
	components:	{
},
	data: () => ({
		colorPaddle: '#00000000',
		colorBall: '#00000000',
		colorPitch: '#FFFFFFFF',
	}),
	methods : {
		send() {
			// playerStore.sendCustomization({})

		},
	}

	}
</script>
  


<template>
	<v-card
		class="justify-center align-center"
		flat
	>	

		<v-card-item
			density="compact"
			class="rounded-pill"
			prepend-icon="mdi-brush"
		>
			<v-card-subtitle
				class="text-overline"
			>
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
			<v-btn text="Send preferences" @click="send" border class="ma-4" color="primary" variant="tonal"></v-btn>
		</v-card-item>

	</v-card>
</template>
