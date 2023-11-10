<script lang="ts">
import { usePlayerStore, PlayerStatus, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
import SearchBar from '../Utils/SearchBar.vue'

const playerStore = usePlayerStore()
const { blockedUsers } = storeToRefs(playerStore)
const debug = false

export default {
	components:	{
		SearchBar
	},
	data: () => ({
		showBlacklist: false,
	}),
	computed : {
		items() : Player[] {
			return blockedUsers.value
		}
	},
	methods : {
	},
	beforeCreate() {
		if (debug) console.log('| BlockedUsers | beforeCreate()')
	},
	created() {
		if (debug) console.log('| BlockedUsers | created(' + (this.items.length) + ')')
	},
	beforeMount() {
		if (debug) console.log('| BlockedUsers | beforeMount(' + (this.items.length) + ')')
	},
	mounted() {
		if (debug) console.log('| BlockedUsers | mounted(' + (this.items.length) + ')')
	},
	beforeUpdate() {
		if (debug) console.log('| BlockedUsers | beforeUpdate(' + (this.items.length) + ')')
	},
	updated() {
		if (debug) console.log('| BlockedUsers | updated(' + (this.items.length) + ')')
	},
	beforeUnmount() {
		if (debug) console.log('| BlockedUsers | beforeUnmount(' + (this.items.length) + ')')
	},
	unmounted() {
		if (debug) console.log('| BlockedUsers | unmounted(' + (this.items.length) + ')')
	},
}
</script>

<template>
	<v-card
		class="component"
		min-width="300"
	>
		<v-card-item>
			<v-card-title class="text-overline">Blacklist</v-card-title>
			<template v-slot:append>
				<v-btn
					:icon="showBlacklist ? 'mdi-chevron-up' : 'mdi-chevron-down'"
					size="small"
					variant="tonal"
					color="blue"
					@click="showBlacklist = !showBlacklist"
				>
				</v-btn>
			</template>
		</v-card-item>
		<v-card-item
			v-if="showBlacklist == true"
			class="ma-0 pa-0"
		>
			<v-divider></v-divider>
			<v-virtual-scroll
				:items="items"
				height="95%"
			>
				<template v-slot:default="{ item }">
						<!-- :prepend-avatar="item.avatar" -->
					<v-list-item
						:title="item.username" 
						:to="{ name: 'profile', params: { id: item.id } }"
						class=" ma-1 pa-2 rounded-pill"
						variant="text"
					>
						<template v-slot:prepend>
								<v-avatar
									:image="item.avatar" 
								>
								</v-avatar>
						</template>
					</v-list-item>
				</template>
			</v-virtual-scroll>			
		</v-card-item>

	</v-card>
</template>


<style scoped>
.component {
	max-width:  100%;
	max-height:  100%;
	width: fit-content;
}

</style>