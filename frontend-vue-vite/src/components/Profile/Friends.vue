<!-- Friends -->

<style>
.containerFriends {
	padding: 2%;
	margin: 2%;
	max-width:  100%;
	max-height:  100%;
	width: fit-content;
}

</style>

<template>
	<v-card
		class="containerFriends"
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
					:title="`${item.username}`" 
					:subtitle="`${item.status}`"
					class=" ma-1 pa-2"
				>

					<template v-slot:prepend>
						<v-badge dot :color="getBadgeColor(`${item.status}`)">
							<v-avatar
								:image="`${item.avatar}`" 
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
  
  <script lang="ts">
  import SearchBar from '../Utils/SearchBar.vue'

	export default {
		components:	{
			SearchBar
		},
	  data: () => ({
		profile: 'FriendProfile' /* FriendProfile | MyProfile | PublicProfile */,
		badgeColor: 'grey',
		items: [
		  {
			username: 'Pauline',
			status: 'online',
			avatar: 'https://avatar.iran.liara.run/public/68',
			my_friend: 1,
		  },
		  {
			username: 'Caroline',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/63',
			my_friend: 0,
		  },
		  {
			username: 'Sarah',
			status: 'online',
			avatar: 'https://avatar.iran.liara.run/public/86',
			my_friend: 0,
		  },
		  {
			username: 'Juliette',
			status: 'playing',
			avatar: 'https://avatar.iran.liara.run/public/89',
			my_friend: 1,
		  },
		  {
			username: 'Aurore',
			status: 'playing',
			avatar: 'https://avatar.iran.liara.run/public/60',
			my_friend: 1,
		  },
		  {
			username: 'Margot',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/61',
			my_friend: 0,
		  },
		  {
			username: 'Mathilde',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/62',
			my_friend: 0,
		  },
		  {
			username: 'Margherite',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/63',
			my_friend: 0,
		  },
		  {
			username: 'Marie-Amélie',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/64',
			my_friend: 0,
		  },
		  {
			username: 'Capucine',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/65',
			my_friend: 0,
		  },
		  {
			username: 'Henriette',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/66',
			my_friend: 0,
		  },
		  {
			username: 'Roberte',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/67',
			my_friend: 0,
		  },
		  {
			username: 'Joséphine',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/68',
			my_friend: 0,
		  },
		  {
			username: 'Marie',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/69',
			my_friend: 0,
		  },
		  {
			username: 'Delphine',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/70',
			my_friend: 0,
		  },
		],
	  }),
	mounted() {
	},
	methods : {
		getBadgeColor(status : string) : string {
			if (status == 'online') return 'green'
			else if (status == 'playing') return 'blue'
			else return 'grey'			
		}
	},
	}
  </script>
  