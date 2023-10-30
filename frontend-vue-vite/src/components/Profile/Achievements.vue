<script lang="ts">
	import { usePlayerStore, type Achievement } from '@/stores/PlayerStore'
	import { storeToRefs } from 'pinia'

	const playerStore = usePlayerStore()
	const { fetchAchievements } = storeToRefs(playerStore)

	export default {
		components:	{
		},
		data: () => ({
			achievements: [] as Achievement[],
			model: null,
		}),
		mounted() {
			this.getAchievements()
		},
		methods : {
			getAchievements() {
				let Profileid : number = Number(this.$route.params.id)
				Profileid = 81841 // TODO change when route update
				fetchAchievements.value(Profileid)
					.then((targetUser : Achievement[]) => {this.achievements = targetUser})
					.catch((err) => console.log(err))
			},
		},
	}
</script>

<template>
	<v-card class="component">
		<v-card-title class="text-overline">Achievements</v-card-title>
		<v-divider></v-divider>
		<v-sheet
			class="componentContents"
		>
			<v-slide-group
				v-model="model"
				class="pa-1"
				selected-class="bg-primary"
				show-arrows
			>
				<v-slide-group-item
					v-for="achievement in achievements"
					:key="achievement.name"
					v-slot="{ isSelected, toggle, selectedClass }"
				>
					<v-card
						:image="achievement.picture"
						:class="['ma-4', selectedClass]"
						height="80"
						width="80"
						@click="toggle"
					>
						<div class="d-flex fill-height align-center justify-center">
							<v-scale-transition></v-scale-transition>
						</div>
					</v-card>
				</v-slide-group-item>
			</v-slide-group>

			<v-expand-transition>
				<v-sheet
					v-if="model != null"
					height="50"
					class="componentDescription d-flex flex-column fill-height justify-center align-center pa-3"
				>
						<v-chip class="text-overline" color="blue">{{ achievements[model].name }}</v-chip>
						<div class="d-flex w-100 align-left px-6 py-2">
							<p class="font-weight-light">{{ achievements[model].description }}</p>
						</div>
				</v-sheet>
			</v-expand-transition>
		</v-sheet>
	</v-card>
</template>

<style scoped>

.componentContents {
	background-color: transparent;
}

.componentDescription {
	background-color: transparent;
}

</style>
