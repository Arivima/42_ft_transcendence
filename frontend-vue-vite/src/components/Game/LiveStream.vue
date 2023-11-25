<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
import { VDataTableServer } from 'vuetify/labs/components'
import { VCardText } from 'vuetify/components'
import axios from 'axios'

const playerStore = usePlayerStore()
const { LiveStream, fetchPlayer } = storeToRefs(playerStore)

const _items_per_page = 5
const debug = true

export interface List {
	host_id: number,
	host_username: string,
	host_avatar: string,
	guest_id: number,
	guest_username: string,
	guest_avatar: string,
}

export default {
	components:	{
		VDataTableServer,
		VCardText
	},

	data: () => ({
		showCustomization: false,
		loading: false,
		itemsPerPage: _items_per_page,
		totalItems: 0,
		list : [] as List[],
		headers: [
			{ title: 'Host', key: 'host.username', align: 'center' },
			{ title: 'Gest', key: 'guest.username', align: 'center' },
			{ title: 'watch', key: 'watch', align: 'start' },
		] as {title: string, key: string, align: 'start' | 'end' | 'center'}[],
	}),
	computed : {
	},
	watch : {
	},
	methods : {
		async fetchData(options: { page: number; itemsPerPage: number }) {
			if (debug) console.log('| Leaderboard | methods | fetchData() page:' + options.page + ' ipp: ' + options.itemsPerPage)
			this.loading = true
			const start = (options.page - 1) * options.itemsPerPage
			const end = start + options.itemsPerPage
			try {
					this.list = []

					for (const [hostId, guestId] of LiveStream.value.entries()) {
						const hostUser: Player = await fetchPlayer.value(hostId);
						const guestUser: Player = await fetchPlayer.value(guestId);

						if (hostUser && guestUser) {
							const listEntry: List = {
								host_id: hostUser.id,
								host_username: hostUser.username,
								host_avatar: hostUser.avatar,
								guest_id: guestUser.id,
								guest_username: guestUser.username,
								guest_avatar: guestUser.avatar,
							};
							this.list.push(listEntry);
						}
					}
				this.totalItems = this.list.length
				this.list = this.list.slice(start, end)
				this.loading = false
			} catch (err) {
				this.list = []
				this.totalItems = 0
				this.loading = false
				console.log(err)
			}
		},
		streamUser(id : number){
			if (debug) console.log('| Leaderboard | methods | streamUser()')
			playerStore.sendStreamingRequest(id)
		},
	},

	}
</script>
  


<template>
	<v-card
		class="component justify-center align-center"	
		min-width="500"
	>
		<v-card-item
			density="compact"
		>
			<v-card-subtitle
				class="text-overline text-center mb-3 pb-3"
			>Now streaming</v-card-subtitle>
		</v-card-item>

		<v-divider></v-divider>

		<v-data-table-server
			v-model:items-per-page="itemsPerPage"
			:items="list"
			:headers=headers
			:items-length="totalItems"
			:loading="loading"
			@update:options="fetchData"
			no-data-text="there is no live game at the moment, please come back later"

			density="compact"
			class="text-caption"
		>
			<template v-slot:item="{ item }">
				<tr>
					<td class="text-center">
						<v-avatar
							:image="item.host_avatar"
							size="small"
							class="my-1 mr-3"
						></v-avatar>
						{{ item.host_username }}
					</td>
					<td class="text-center">
						<v-avatar
							:image="item.guest_avatar"
							size="small"
							class="my-1 mr-3"
						></v-avatar>
						{{ item.guest_username }}
					</td>
					<td class="text-start">
						<v-btn
								icon="mdi-play"
								size="x-small"
								color="primary"
								class="ma-0 pa-0 justify-center align-center"
								@click="streamUser(item.host_id)"
						></v-btn>
					</td>
				</tr>
			</template>	
		</v-data-table-server>
	</v-card>
</template>

<style scoped>
.component {
	max-width:  100%;
	max-height:  100%;
	width: fit-content;
}

</style>


