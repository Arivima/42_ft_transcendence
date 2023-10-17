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
			src="Blue_small.jpg"
		>
			<v-avatar
				size="130"
				rounded="1"
			>
				<v-img cover src="https://avatar.iran.liara.run/public/68"></v-img>
			</v-avatar>

			<v-list-item
				class="text-white"
				title="username"
				subtitle="FirstName + FamilyName"
			></v-list-item>

		</v-img>
	<!-- <Stats/> -->
	</v-card>

</template>
