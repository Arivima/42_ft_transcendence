<!-- Friends -->
<!-- TODO
- Use max-height based on page height 
-->

<style>
.containerFriends {
	padding: 2%;
	margin: 2%;
	max-width:  95%;
	max-height:  95%;
	width: 400px;
}

</style>

<template>
	<v-card class="containerFriends" >
	  <v-card-item>
		<v-card-title class="text-overline">Friends</v-card-title>
  
		<template v-slot:append>
		  <v-btn icon="mdi-plus" size="small"></v-btn>
		</template>
	  </v-card-item>
  
	  <v-divider></v-divider>
  
		<v-virtual-scroll
			:items="items"
			height="90%"
		
		>
			<template v-slot:default="{ item }">
				<v-list-item
					:title="`${item.username}`" 
					:subtitle="`${item.status}`"
				>
					<template v-slot:prepend
						><v-avatar
						image="https://avatar.iran.liara.run/public/68"
						></v-avatar
					></template>
					<template v-slot:append>
						<v-btn
						v-if="`${item.status}` === 'playing'"
						icon="mdi-play"
						size="x-small"
						variant="tonal"
						></v-btn>

						<v-btn
						v-if="`${item.my_friend}` === '0'"
						icon="mdi-account-plus"
						size="x-small"
						variant="tonal"
						></v-btn>

						<v-btn
						v-if="`${item.my_friend}` === '1'"
						icon="mdi-account-remove"
						size="x-small"
						variant="tonal"
						></v-btn>

						<v-btn
						v-if="`${item.my_friend}` === '1'"
						icon="mdi-chat"
						size="x-small"
						variant="tonal"
						></v-btn>

						<v-btn
						v-if="`${item.status}` === 'online'"
						icon="mdi-controller-classic"
						size="x-small"
						variant="tonal"
						></v-btn>

						<v-btn
						v-if="`${item.my_friend}` === '1'"
						icon="mdi-account-cancel"
						size="x-small"
						variant="tonal"
						></v-btn>
					</template>
				</v-list-item>
			</template>
		</v-virtual-scroll>
	</v-card>
  </template>
  
  <script lang="ts">
	export default {
	  data: () => ({
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
			avatar: 'https://avatar.iran.liara.run/public/89',
			my_friend: 1,
		  },
		  {
			username: 'Margot',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/89',
			my_friend: 0,
		  },
		  {
			username: 'Mathilde',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/89',
			my_friend: 0,
		  },
		  {
			username: 'Margherite',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/89',
			my_friend: 0,
		  },
		  {
			username: 'Marie-Amélie',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/89',
			my_friend: 0,
		  },
		  {
			username: 'Capucine',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/89',
			my_friend: 0,
		  },
		  {
			username: 'Anne-Fleur',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/89',
			my_friend: 0,
		  },
		  {
			username: 'Anne-Fleur',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/89',
			my_friend: 0,
		  },
		  {
			username: 'Anne-Opale',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/89',
			my_friend: 0,
		  },
		  {
			username: 'Anne-Marie',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/89',
			my_friend: 0,
		  },
		  {
			username: 'Marie-Anne',
			status: 'offline',
			avatar: 'https://avatar.iran.liara.run/public/89',
			my_friend: 0,
		  },
		],
	  }),
	}
  </script>
  