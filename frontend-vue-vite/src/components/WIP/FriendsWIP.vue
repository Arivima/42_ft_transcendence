<template>
	<v-card class="mx-auto" max-width="300">
	  <v-card-item>
		<v-card-title class="text-overline">Friends</v-card-title>
  
		<template v-slot:append>
		  <v-btn icon="mdi-plus" size="small"></v-btn>
		</template>
	  </v-card-item>
  
	  <v-divider></v-divider>
  
	  <v-virtual-scroll
	  	:items="items"
		height="300"
		item-height="50">
		<template v-slot:default="{ item }">

		  <v-list-item :title="item.username" :subtitle="item.status">
			
			<template v-slot:prepend
			  ><v-avatar
				image="https://avatar.iran.liara.run/public/68"
			  ></v-avatar
			></template>

			<template v-slot:append>

				<ButtonIcon
					icon="mdi-open-in-app"
					routeTo="profile"
				></ButtonIcon>

				<ButtonIcon
					v-if="items.my_friend === 0"
					icon="mdi-account-plus"
				></ButtonIcon>

				<ButtonIcon
					v-if="items.my_friend === 1"
					icon="mdi-account-remove"
				></ButtonIcon>

				<ButtonIcon
					v-if="`${item.my_friend}` === 1"
					icon="mdi-chat"
				></ButtonIcon>

				<ButtonIcon
					v-if="`${item.status}` === 'online'"
					icon="mdi-controller-classic"
				></ButtonIcon>

				<ButtonIcon
					v-if="`${item.my_friend}` === 1"
					icon="mdi-account-cancel"
				></ButtonIcon>

		
			</template>
		  </v-list-item>
		</template>
	  </v-virtual-scroll>
	</v-card>
  </template>
  
  <script lang="ts">
  import ButtonIcon from '../Utils/ButtonIcon.vue'
  import { ref } from 'vue';

	const items = ref([
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
	]);
  </script>
  