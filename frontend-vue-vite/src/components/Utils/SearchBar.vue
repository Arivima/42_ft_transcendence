<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user, friends, fetchPublicUsers } = storeToRefs(playerStore)

const debug = false

export default {
	components : {
	},
	data() {
		return {
			loading : false,
			dummyUsers: [
				{
					id: user.value.id ,
					username: user.value.username ,
					avatar: user.value.avatar ,
					fullName: user.value.firstName + " " +  user.value.lastName ,
				},

			],
			publicUsers : [] as Player[]
		}
	},
	computed: {
	},
	methods: {
		async fetchUsers() {
			if (debug) console.log('| SearchBar | methods | fetchUsers()' )
			this.loading = true
			try {
				this.publicUsers = (await fetchPublicUsers.value(user.value.id))
				const playerIds: number[] = this.publicUsers.map(player => player.id);
				if (debug) console.log('| SearchBar | methods | fetchUsers() Value publicUsers : ' + playerIds)
				this.loading = false
			}
			catch (error) {
				console.error(`SearchBar : methods : fetchUsers() : Exception: ${error}`)
				this.loading = false
			}
		},
		addAsFriend(id : number){
			if (debug) console.log(`addAsFriend: userProfile.id = ${id}, typeof is: ${typeof id}`)
			playerStore.sendFriendshipRequest(Number(id));
			this.fetchUsers()
			// this.state = 'pending';//! WAS MODIFIED
		},
	},
	watch : {
	},

	beforeCreate() {
	if (debug) console.log('| SearchBar | beforeCreate()' )
	},
	async created() {
		if (debug) console.log('| SearchBar | created(' + (user.value.id) + ')')
		this.fetchUsers()
	},
	beforeMount() {
		if (debug) console.log('| SearchBar | beforeMount(' + (user.value.id) + ')')
	},
	mounted() {
		if (debug) console.log('| SearchBar | mounted(' + (user.value.id) + ')')
	},
	async beforeUpdate() {
		if (debug) console.log('| SearchBar | beforeUpdate(' + (user.value.id) + ')')
		this.fetchUsers()
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
		<!-- :loading="loading" -->
	<v-card
		class="SearchBar d-flex justify-center flex-wrap "
		variant="flat"
	>
		<v-responsive
		max-width="550"
		min-width="fit-content"
		>
				<!-- custom-filter="" -->
			<v-autocomplete
				:items="publicUsers"
				auto-select-first
				item-props
				item-title="username"
				menu-icon=""

				prepend-inner-icon="mdi-magnify"
				placeholder="Search a player"
				clearable
				clear-icon="mdi-close-circle"

				class="flex-full-width pa-1"
				density="compact"
				rounded
				variant="outlined"
				bg-color="white"
				color="primary"
			>

				<template v-slot:item="{ props, item }">
						<!-- :to="{ name: 'profile', params: { id: item?.raw?.id } }" -->
					<v-list-item
						v-bind="props"
						:title="item?.raw?.username"
						:subtitle="item?.raw?.firstName + ' ' +  item?.raw?.lastName"
						:prepend-avatar="item?.raw?.avatar"
						append-icon="mdi-account-plus"
					>
						<template v-slot:prepend>
							<v-avatar size="small"> </v-avatar>
						</template>							
						<template v-slot:append>
							<v-icon
								@click="addAsFriend(item?.raw?.id)"
								prepend-icon="mdi-account-plus"
								color="primary"
							>
							</v-icon>
						</template>
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
