<!-- Friends -->

<style>
.containerAddFriend {
	padding: 2%;
	margin: 2%;
	max-width:  100%;
	max-height:  100%;
	width: fit-content;
	outline: solid;
	background-color: bisque;
}

</style>

<template>
	<v-card
		class="containerAddFriend justify-center align-center pa-1"	
		min-width="300"
	>
		<v-card-item
		>
			<v-card-title class="text-overline">Add a new friend</v-card-title>
			<template v-slot:append>
				<v-btn
					icon="mdi-plus"
					size="small"
					@click="showBar = !showBar"
					color="orange"
					class="outline='solid'"
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
  
<script lang="ts">
	import SearchBar from '../Utils/SearchBar.vue'

	export default {
		components:	{
			SearchBar
		},
		data: () => ({
			showBar: false,
		}),
		mounted() {
		},
	}
</script>
  