<style scoped>
.component .v-table {
	background-color: transparent;
}

/* table title row */
.v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th {
	background-color: transparent;
}
</style>

<template>
	<v-card class="component">
		<v-card-item>
			<v-card-title class="text-overline">Match history</v-card-title>
		</v-card-item>
		<v-divider></v-divider>
		<v-data-table
			v-model:items-per-page="data.itemsPerPage"
			:headers="data.headers"
			:items="games"
			item_value="name"
			class="elevation-1"
		></v-data-table>
	</v-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { usePlayerStore } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
import { VDataTable } from 'vuetify/labs/components'

const { user, games } = storeToRefs(await usePlayerStore())

//TODO FIX and avoid using STORE
const data = reactive({
	headers: [
		{ title: 'Host', key: 'host', align: 'start' },
		{ title: 'Score', key: 'host_score', align: 'start' },
		{ title: 'Score', key: 'guest_score', align: 'start' },
		{ title: 'Guest', key: 'guest', align: 'start' }
	],
	itemsPerPage: 5,
	items_len: 11,
	loading: false,
	games: games.value,
	user: {
		username: user.value.username
	}
})
</script>
