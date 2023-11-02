<script lang="ts">
import { usePlayerStore, PlayerStatus, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
import SearchBar from '../Utils/SearchBar.vue'

const playerStore = usePlayerStore()
const { friends } = storeToRefs(playerStore)
const debug = false

export default {
	components:	{
		SearchBar
	},
	data: () => ({
		badgeColor: 'grey',
		items: friends.value as Player[],
	}),
	methods : {
		getBadgeColor(status : PlayerStatus) : string {
			if (debug) console.log('| Friends | methods | getBadgeColor()')
			if (status == PlayerStatus.online) return 'green'
			else if (status == PlayerStatus.playing) return 'blue'
			else return 'grey'			
		}
	},
	beforeCreate() {
		if (debug) console.log('| Friends | beforeCreate()')
	},
	created() {
		if (debug) console.log('| Friends | created(' + (this.items.length) + ')')
	},
	beforeMount() {
		if (debug) console.log('| Friends | beforeMount(' + (this.items.length) + ')')
	},
	mounted() {
		if (debug) console.log('| Friends | mounted(' + (this.items.length) + ')')
	},
	beforeUpdate() {
		if (debug) console.log('| Friends | beforeUpdate(' + (this.items.length) + ')')
	},
	updated() {
		if (debug) console.log('| Friends | updated(' + (this.items.length) + ')')
	},
	beforeUnmount() {
		if (debug) console.log('| Friends | beforeUnmount(' + (this.items.length) + ')')
	},
	unmounted() {
		if (debug) console.log('| Friends | unmounted(' + (this.items.length) + ')')
	},
}
</script>

<template>
	<v-card
		class="component"
		min-width="300"
	>
		<v-card-item>
			<v-card-title class="text-overline">Friends</v-card-title>
		</v-card-item>
		<v-divider></v-divider>
		<v-virtual-scroll
			:items="items"
			height="95%"
		>
			<template v-slot:default="{ item }">
				<v-list-item
					:title="item.username" 
					:subtitle="item.status"
					:to="{ name: 'profile', params: { id: item.id } }"
					class=" ma-1 pa-2 rounded-pill"
					variant="text"
				>
					<template v-slot:prepend>
						<v-badge dot :color="getBadgeColor(item.status)">
							<v-avatar
								:image="item.avatar" 
							>
							</v-avatar>
						</v-badge>
					</template>
					<template v-slot:append>
						<v-btn
							v-if="`${item.my_friend}` === '0'"
							icon="mdi-account-plus"
							size="x-small"
							variant="tonal"
							color="blue"
						>
						</v-btn>
						<v-btn
							v-if="`${item.my_friend}` === '1'"
							icon="mdi-account-remove"
							size="x-small"
							variant="tonal"

						>
						</v-btn>
					</template>
				</v-list-item>
			</template>
		</v-virtual-scroll>
	</v-card>
</template>


<style scoped>
.component {
	max-width:  100%;
	max-height:  100%;
	width: fit-content;
}

</style>