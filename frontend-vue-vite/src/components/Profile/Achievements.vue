<script setup lang="ts">
import { ref } from 'vue';
	const data = ref({model:{}})
</script>

<template>
	<v-card class=" pa-2 ma-2">
		<v-card-title class="text-overline">Achievements</v-card-title>

		<v-divider></v-divider>

		<v-sheet
		>
			<v-slide-group
			v-model="model"
			class="pa-1"
			selected-class="bg-primary"
			show-arrows
			>
			<v-slide-group-item
				v-for="n in 5"
				:key="n"
				v-slot="{ isSelected, toggle, selectedClass }"
			>
				<v-card
				color="grey-lighten-1"
				:class="['ma-1', selectedClass]"
				height="80"
				width="80"
				@click="toggle"
				>
				<div class="d-flex fill-height align-center justify-center">
					<v-scale-transition>
					<v-icon
						v-if="isSelected"
						color="white"
						size="48"
						icon="mdi-close-circle-outline"
					></v-icon>
					</v-scale-transition>
				</div>
				</v-card>
			</v-slide-group-item>
			</v-slide-group>

			<v-expand-transition>
			<v-sheet
				v-if="model != null"
				max-height="50"
			>
				<div class="d-flex fill-height align-center justify-center">
				<p class="text-p">
					Achievement : {{ model }}
				</p>
				</div>
			</v-sheet>
			</v-expand-transition>
		</v-sheet>

	</v-card>
</template>

