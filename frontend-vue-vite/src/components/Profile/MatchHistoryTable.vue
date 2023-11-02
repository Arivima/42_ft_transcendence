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
		searchedGuest: '',
		searchedHost: '',
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
		userProfile(newValue : Player){
			if (debug) console.log('| MatchHistoyTable | watch | userProfile : new value : ' + newValue.username)
			this.fetchData({page: 1 , itemsPerPage :  this.itemsPerPage})
		},
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
		<v-data-table-server
			v-model:items-per-page="itemsPerPage"
			:items="games"
			:search="search"
			:headers=headers
			:items-length="totalItems"
			:loading="loading"
			class="elevation-1 text-caption"
			@update:options="fetchData"

			density="compact"
			hover
		>
			<template v-slot:tfoot>
				<div class="d-flex">
						<v-text-field
							v-model="searchedHost"
							hide-details
							placeholder="search host"
							class="mr-1 mt-1 text-caption"
							type="string"
							density="compact"
							
						></v-text-field>
						<v-text-field
							v-model="searchedGuest"
							hide-details
							placeholder="search guest"
							class="ml-1 mt-1 text-caption "
							type="string"
							density="compact"
						></v-text-field>
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