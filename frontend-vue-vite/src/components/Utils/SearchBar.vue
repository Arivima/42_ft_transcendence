<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user, fetchPublicUsers } = storeToRefs(playerStore)

const debug = true

export default {
	data() {
		return {
			loading : false,
			labelText: 'Search a Player',
			labelColor: 'primary',
			publicUsers : [] as Player[]
		}
	},
	computed: {
	},
	methods: {
		async fetchUsers() {
			if (debug) console.log('| SearchBar | methods | fetchUsers() IN' )
			this.loading = true;
			try {
				//TODO how to render immediately without change in the picture ?
				const tempUsers  : Player[] = (await fetchPublicUsers.value(user.value.id))
				this.publicUsers = tempUsers
				const playerIds: number[] = this.publicUsers.map(player => player.id);
				if (debug) console.log('| SearchBar | methods | fetchUsers() publicUsers' + playerIds )
				this.loading = false
				if (debug) console.log('| SearchBar | methods | fetchUsers() LOADING FALSE' )
				if (debug) console.log('| SearchBar | methods | fetchUsers() OUT' )
			}
			catch (error) {
				console.error(`SearchBar : methods : fetchUsers() : Exception: ${error}`)
				this.loading = false
			}
		},
		async addAsFriend(id : number, username : string){
			if (debug) console.log(`addAsFriend: userProfile.id = ${id}, typeof is: ${typeof id}`)
			playerStore.sendFriendshipRequest(Number(id));
			this.labelText = 'Request sent to ' + username;
			this.labelColor = 'success'
			await this.fetchUsers()
			setTimeout(() => {
				this.labelText = 'Search a Player',
				this.labelColor = 'primary'
			}, 4000);
		},
		customFilter (itemTitle : string, queryText : string, item : any) {
			// if (debug) console.log('| SearchBar | methods | customFilter() '  + itemTitle)

			const textOne = item.raw.username.toLowerCase()
			const textTwo = item.raw.firstName.toLowerCase()
			const textThree = item.raw.lastName.toLowerCase()
			const searchText = queryText.toLowerCase()

			return (
				textOne.indexOf(searchText) > -1 ||
				textTwo.indexOf(searchText) > -1 ||
				textThree.indexOf(searchText) > -1
			)
		},
	},
	watch : {
	},
	beforeCreate() {
	if (debug) console.log('| SearchBar | beforeCreate()' )
	},
	async created() {
		if (debug) console.log('| SearchBar | created(' + (user.value.id) + ')')
		await this.fetchUsers()
	},
	beforeMount() {
		if (debug) console.log('| SearchBar | beforeMount(' + (user.value.id) + ')')
	},
	mounted() {
		if (debug) console.log('| SearchBar | mounted(' + (user.value.id) + ')')
	},
	beforeUpdate() {
		if (debug) console.log('| SearchBar | beforeUpdate(' + (user.value.id) + ')')
	},
	updated() {
		if (debug) console.log('| SearchBar | updated(' + (user.value.id) + ')')
	},
	beforeUnmount() {
		if (debug) console.log('| SearchBar | beforeUnmount(' + (user.value.id) + ')')
	},
	unmounted() {
		if (debug) console.log('| SearchBar | unmounted(' + (user.value.id) + ')')
	},
}
</script>

<template>
	<v-card
		class="SearchBar d-flex justify-center flex-wrap "
		variant="flat"
		:loading="loading"
	>
		<v-responsive
		max-width="550"
		min-width="fit-content"
		>
			<v-autocomplete
				:items="publicUsers"
				auto-select-first
				item-props
				menu-icon=""
				item-title="username"
				item-value="username"
				:custom-filter="customFilter"

				prepend-inner-icon="mdi-magnify"
				:label="labelText"
				:color="labelColor"
				clearable
				clear-icon="mdi-close-circle"
				no-data-text="No existing user"

				class="flex-full-width pa-1 ma-1"
				density="compact"
				rounded
				variant="outlined"
				bg-color="white"
			>

				<template v-slot:item="{ props, item }">
					<v-list-item class="ma-0 pa-1">
						<div
							style="
								display:inline-flex;
								justify-content: space-between;
								width: 100%;
								"
						>
							<v-list-item 
								style="flex-grow: 2;"
								v-bind="props"
								:to="{ name: 'profile', params: { id: item?.raw?.id } }"
								:title="item?.raw?.username"
								:subtitle="item?.raw?.firstName + ' ' +  item?.raw?.lastName"
								:prepend-avatar="item?.raw?.avatar"
								rounded="xl"
								append-icon="mdi-account-eye"
							>
								<template v-slot:prepend>
									<v-avatar size="small"> </v-avatar>
								</template>
								<template v-slot:append>
									<v-icon color="primary" class="ma-0 pa-0"> </v-icon>
								</template>
						</v-list-item>
							<v-list-item>
								<v-btn
									@click="addAsFriend(item?.raw?.id, item?.raw?.username)"
									icon="mdi-account-plus"
									color="primary"
									variant="tonal"
									size="small"
									ripple
								>
								</v-btn>								
							</v-list-item>

						</div>
					</v-list-item>
				</template>

			</v-autocomplete>
		</v-responsive>
	</v-card>
</template>

<style scoped>
.SearchBar {
	background-color: transparent;
}


</style>
