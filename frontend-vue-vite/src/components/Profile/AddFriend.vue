<script lang="ts">
import SearchBar from '../Utils/SearchBar.vue'

export default {
	components:	{
		SearchBar
	},
	data: () => ({
		showBar: false,
	}),
	beforeCreate() {
	console.log('| AddFriends | beforeCreate()')
	},
	created() {
		console.log('| AddFriends | created()')
	},
	beforeMount() {
		console.log('| AddFriends | beforeMount()')
	},
	mounted() {
		console.log('| AddFriends | mounted()')
	},
	beforeUpdate() {
		console.log('| AddFriends | beforeUpdate()')
	},
	updated() {
		console.log('| AddFriends | updated()')
	},
	beforeUnmount() {
		console.log('| AddFriends | beforeUnmount()')
	},
	unmounted() {
		console.log('| AddFriends | unmounted()')
	},
	}
</script>
  


<template>
	<v-card
		class="component justify-center align-center"	
		min-width="300"
	>
		<v-card-item
		>
			<v-card-title class="text-overline">Add a new friend</v-card-title>
			<template v-slot:append>
				<v-btn
					icon="mdi-plus"
					size="small"
					variant="tonal"
					color="blue"
					@click="showBar = !showBar"
				>
				</v-btn>
			</template>
		</v-card-item>
		<v-card-item
			class="px-2 py-0 ma-0"
			v-if="showBar == true"
		>
			<SearchBar/>
		</v-card-item>

	</v-card>
</template>

<style scoped>
.component {
	max-width:  100%;
	max-height:  100%;
	width: fit-content;
}

</style>