<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
import { VDataTableServer } from 'vuetify/labs/components'
import { VCardText } from 'vuetify/components'
import axios from 'axios'

const playerStore = usePlayerStore()
const { liveStreams, fetchPlayer } = storeToRefs(playerStore)

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
		list : liveStreams,
		headers: [
			{ title: 'Host', key: 'host.username', align: 'center' },
			{ title: 'Gest', key: 'guest.username', align: 'center' },
			{ title: 'watch', key: 'watch', align: 'start' },
		] as {title: string, key: string, align: 'start' | 'end' | 'center'}[],
	}),
	created() {
		playerStore.sendGetActiveGames();
	},
	computed : {
	},
	watch : {
	},
	methods : {
		async fetchData(options: { page: number; itemsPerPage: number }) {
			playerStore.sendGetActiveGames();
			// playerStore.sendGetActiveGames();
			// this.list = Array.from(
			// 	liveStreams.value as Map<any, any>, (el, _) => {
			// 		let [key, val] = el;
			// 		return {
			// 			host_id: key,
			// 			guest_id: val,
			// 		} as List;
			// 	}
			// )
		},
		streamUser(id : number){
			if (debug) console.log('| Leaderboard | methods | streamUser()')
			playerStore.sendStreamingRequest(id);
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
							:image="item.hostAvatar"
							size="small"
							class="my-1 mr-3"
						></v-avatar>
						{{ item.hostUsername }}
					</td>
					<td class="text-center">
						<v-avatar
							:image="item.guestAvatar"
							size="small"
							class="my-1 mr-3"
						></v-avatar>
						{{ item.guestUsername }}
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


