<script setup lang="ts">
import Stats from './Stats.vue'

</script>

<template>
	<v-card
		width="780"
		max-height="200"
		class="pa-2 ma-2"
	>
		<v-img
		height="100%"
		cover
		src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
		>
		<v-avatar
			size="130"
			rounded="1"
		>
			<v-img cover src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
		</v-avatar>
		<v-list-item
			class="text-white"
			title="username"
			subtitle="FirstName + FamilyName"
		></v-list-item>
	<Stats/>
		</v-img>
	</v-card>

</template>
