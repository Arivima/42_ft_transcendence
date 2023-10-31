<script lang="ts">
import { usePlayerStore, type Achievement, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { fetchAchievements, user, achievements } = storeToRefs(playerStore)

export default {
	components:	{
	},
	props: {
		userProfile: {
			type: Object as () => Player,
			required: true
		},
	},
	data: () => ({
		userVisitor: user.value as Player,
		achievements: [] as Achievement[],
		model: null,
		loading: false,
	}),
	watch : {
		userProfile(newValue : Player){
			console.log('| Achievements | watch | userProfile : new value : ' + newValue.username)
			this.fetchAchievements(newValue.id)
		},
	},
	methods : {
		fetchAchievements(id : number) {
			console.log('| Achievements | methods | fetchAchievements()')
			this.loading = true
			if (!id || id == this.userVisitor.id)
				this.achievements = achievements.value //MY PROFILE
			else
				fetchAchievements.value(id)
					.then((userAchievements : Achievement[]) => {
						this.achievements = userAchievements
						this.loading = false
					})
					.catch((err : Error) => {
						console.log(err)
						this.loading = false
					})
		},
	},
	beforeCreate() {
	console.log('| Achievements | beforeCreate()')
	},
	created() {
		console.log('| Achievements | created()')
	},
	beforeMount() {
		console.log('| Achievements | beforeMount()')
		this.fetchAchievements(this.userProfile.id)
	},
	mounted() {
		console.log('| Achievements | mounted()')
	},
	beforeUpdate() {
		console.log('| Achievements | beforeUpdate()')
	},
	updated() {
		console.log('| Achievements | updated()')
	},
	beforeUnmount() {
		console.log('| Achievements | beforeUnmount()')
	},
	unmounted() {
		console.log('| Achievements | unmounted()')
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
