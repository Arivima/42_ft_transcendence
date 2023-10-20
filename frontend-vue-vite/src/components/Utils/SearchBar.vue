<style>

</style>

<template>
	<v-card
		class="d-flex justify-center flex-wrap "
		variant="flat"
	>
	  <v-responsive
		max-width="550"
		min-width="fit-content"
	>
		<v-autocomplete
		  :items="items"
		  auto-select-first
		  item-props

		  prepend-inner-icon="mdi-magnify"
		  placeholder="Search a player"
		  menu-icon=""
		  clearable
		  clear-icon="mdi-close-circle"

		  class="flex-full-width pa-1"
		  density="compact"
		  rounded
		  variant="outlined"
		></v-autocomplete>
	  </v-responsive>
	</v-card>
  </template>
  
  <script lang="ts">
	export default {
	  data: () => ({
		dialog: false,
		items: [
		  {
			prependIcon: 'mdi-clock-outline',
			title: 'recipe with chicken',
		  },
		  {
			prependIcon: 'mdi-clock-outline',
			title: 'best hiking trails near me',
		  },
		  {
			prependIcon: 'mdi-clock-outline',
			title: 'how to learn a new language',
		  },
		  {
			prependIcon: 'mdi-clock-outline',
			title: 'DIY home organization ideas',
		  },
		  {
			prependIcon: 'mdi-clock-outline',
			title: 'latest fashion trends',
		  },
		],
	  }),
	}
  </script>