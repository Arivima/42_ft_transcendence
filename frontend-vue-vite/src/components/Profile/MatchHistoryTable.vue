<script lang="ts">
import { usePlayerStore, type Game, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
import { VDataTableServer } from 'vuetify/labs/components'

const playerStore = usePlayerStore()
const { fetchGames } = storeToRefs(playerStore)
const _items_per_page = 5

//TODO
//2.	add toast for data loading error
//LATER_FOR_FRIENDS_TABLE3.	use web sockets (socket.io)
//4.	clean the user store
//TODO FIX and avoid using STORE
export default {
	components: {
		VDataTableServer
	},
	props: {
		userProfile: {
			type: Object as () => Player,
			required: true
		},
	},
	data: () => ({
		games: [] as Game[],
		itemsPerPage: _items_per_page,
		search: '',
		headers: [
			{ title: 'Date', key: 'dateString', align: 'start' },
			{ title: 'Host', key: 'host', align: 'start' },
			{ title: 'Score', key: 'host_score', align: 'start' },
			{ title: 'Score', key: 'guest_score', align: 'start' },
			{ title: 'Guest', key: 'guest', align: 'start' }
		] as {title: string, key: string, align: 'start' | 'end' | 'center'}[],
		totalItems: 0,
		loading: true,
		searchedGuest: '',
		searchedHost: '',
	}),
	methods: {
		async fetchData(options: { page: number; itemsPerPage: number }) {
			this.loading = true
			const start = (options.page - 1) * options.itemsPerPage
			const end = start + options.itemsPerPage
			try {
				// await this.getUserProfile()
				this.games = await fetchGames.value(this.userProfile.id)
				this.games = this.games.filter((game) => {
					if (
						this.searchedGuest &&
						false == game.guest.toLowerCase().includes(this.searchedGuest.toLowerCase())
					)
						return false
					if (
						this.searchedHost &&
						false == game.host.toLowerCase().includes(this.searchedHost.toLowerCase())
					)
						return false
					return true
				})
				this.games.sort((a: Game, b: Game) => {
					return Date.parse(b.createdAt) - Date.parse(a.createdAt)
				})
				this.totalItems = this.games.length
				this.games = this.games.slice(start, end)
				this.loading = false
			} catch (err) {
				//TODO show toast
				this.games = []
				this.totalItems = 0
				this.loading = false
				console.log(err)
			}
		}
	},
	watch: {
		// TODO ?
		// userProfile(newValue : Player){
		// 	this.fetchData()
		// },
		searchedGuest: {
			handler() {
				this.search = String(Date.now())
			},
			immediate: true
		},
		searchedHost: {
			handler() {
				this.search = String(Date.now())
			},
			immediate: false
		}
	}
}
</script>

<template>
	<v-card class="component">
		<v-card-item>
			<v-card-title class="text-overline">Match history</v-card-title>
		</v-card-item>
		<v-divider></v-divider>
		<v-data-table-server
			v-model:items-per-page="itemsPerPage"
			:items="games"
			:search="search"
			:headers=headers
			:items-length="totalItems"
			:loading="loading"
			class="elevation-1"
			@update:options="fetchData"
		>
			<template v-slot:tfoot>
				<tr style="display: flex; width: 200%">
					<td>
						<v-text-field
							v-model="searchedHost"
							hide-details
							placeholder="host..."
							class="ma-2"
							type="string"
							density="compact"
						></v-text-field>
					</td>
					<td>
						<v-text-field
							v-model="searchedGuest"
							hide-details
							placeholder="guest..."
							class="ma-2"
							type="string"
							density="compact"
						></v-text-field>
					</td>
				</tr>
			</template>
		</v-data-table-server>
	</v-card>
</template>

<style scoped>
.component .v-table {
	background-color: transparent;
}

/* table title row */
.v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th {
	background-color: transparent;
}
</style>