<script lang="ts">
import { usePlayerStore, type Game, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
import { VCardText } from 'vuetify/components'
import { VDataTableServer } from 'vuetify/labs/components'

const playerStore = usePlayerStore()
const { fetchGames } = storeToRefs(playerStore)
const _items_per_page = 5

const debug = false

//TODO
//2.	add toast for data loading error
//LATER_FOR_FRIENDS_TABLE3.	use web sockets (socket.io)
//4.	clean the user store
//TODO FIX and avoid using STORE
export default {
	components: {
    VDataTableServer,
    VCardText
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
		searchedBoth: '',
	}),
	methods: {
		async fetchData(options: { page: number; itemsPerPage: number }) {
			if (debug) console.log('| MatchHistoyTable | methods | fetchData() page:' + options.page + ' ipp: ' + options.itemsPerPage)
			this.loading = true
			const start = (options.page - 1) * options.itemsPerPage
			const end = start + options.itemsPerPage
			try {
				// await this.getUserProfile()
				this.games = await fetchGames.value(this.userProfile.id)
				this.games = this.games.filter((game) => {
					if (
						this.searchedBoth &&
						(false == game.guest.toLowerCase().includes(this.searchedBoth.toLowerCase()) &&
						false == game.host.toLowerCase().includes(this.searchedBoth.toLowerCase()))
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
		},
		getColor(hostA : String, a : Number, b : Number){
			if (hostA == this.userProfile.username)
				return (a > b ? 'success' : a == b ? 'warning' : 'error')
			else
				return ('grey-darken-2')
		}
	},
	watch: {
		userProfile(newValue : Player){
			if (debug) console.log('| MatchHistoyTable | watch | userProfile : new value : ' + newValue.username)
			this.fetchData({page: 1 , itemsPerPage :  this.itemsPerPage})
		},
		searchedBoth: {
			handler() {
				this.search = String(Date.now())
			},
			immediate: true
		},
	},
	beforeCreate() {
		if (debug) console.log('| MatchHistoyTable | beforeCreate()')
	},
	created() {
		if (debug) console.log('| MatchHistoyTable | created(' + (this.userProfile.id) + ')')
	},
	beforeMount() {
		if (debug) console.log('| MatchHistoyTable | beforeMount(' + (this.userProfile.id) + ')')
	},
	mounted() {
		if (debug) console.log('| MatchHistoyTable | mounted(' + (this.userProfile.id) + ')')
	},
	beforeUpdate() {
		if (debug) console.log('| MatchHistoyTable | beforeUpdate(' + (this.userProfile.id) + ')')
	},
	updated() {
		if (debug) console.log('| MatchHistoyTable | updated(' + (this.userProfile.id) + ')')
	},
	beforeUnmount() {
		if (debug) console.log('| MatchHistoyTable | beforeUnmount(' + (this.userProfile.id) + ')')
	},
	unmounted() {
		if (debug) console.log('| MatchHistoyTable | unmounted(' + (this.userProfile.id) + ')')
	},
}
</script>

<template>
	<v-card class="component">
		<v-card-item>
			<v-card-title class="text-overline">Match history</v-card-title>
		</v-card-item>
		<v-divider></v-divider>
			<!-- style="background-color: white; " -->
		<v-data-table-server
			v-model:items-per-page="itemsPerPage"
			:items="games"
			:search="search"
			:headers=headers
			:items-length="totalItems"
			:loading="loading"
			@update:options="fetchData"

			density="compact"
			hover
			class="text-caption"
		>

			<!-- <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
				<tr>
					<template v-for="column in columns" :key="column.key">
						<td
							style="background-color: transparent;"

						>
							<span
								class="mr-2 cursor-pointer"
								@click="() => toggleSort(column)"
								style="	font-weight: bold;"
							>
								{{ column.title }}
							</span>
						</td>
					</template>
				</tr>
			</template> -->

			<template v-slot:item="{ item }">
				<tr
					style="background-color: transparent;"
				>
					<td style="background-color: transparent;">{{ item.dateString }}</td>
					<td style="background-color: transparent;">{{ item.host }}</td>
					<td style="background-color: transparent;">
						<v-chip
							:color="getColor(item.host, item.host_score, item.guest_score)"
							:variant="item.host != userProfile.username ? 'text' : 'tonal'"
						>
							{{ item.host_score }}
						</v-chip>
					</td>
					<td style="background-color: transparent;">
						<v-chip
							:color="getColor(item.guest, item.guest_score, item.host_score)"
							:variant="item.guest != userProfile.username ? 'text' : 'tonal'"
						>
							{{ item.guest_score }}
						</v-chip>
					</td>
					<td style="background-color: transparent;">{{ item.guest }}</td>
				</tr>
			</template>

			<template v-slot:tfoot>
				<div class="d-flex">
					<v-text-field
						v-model="searchedBoth"
						hide-details
						class="ml-1 mt-3 text-caption"
						type="string"
						density="compact"
					>
					<template v-slot:label>
						<v-label style="font-size: small; font-style: italic;">search username</v-label>
					</template>
					</v-text-field>
				</div>
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