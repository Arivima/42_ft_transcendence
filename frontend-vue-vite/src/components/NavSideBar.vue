<!-- TODO
- overall size on the page
- bigger avatar and icons
- script link to database to show user info
-->

<script lang="ts">
export default {
	data() {
		return {
			user : {
				username : 'avilla-m',
				firstName : 'Arielle',
				familyName : 'Villa-Massone',
				avatar : 'https://avatar.iran.liara.run/public/93',
			},
		};

	},
}
</script>


<template>
	<v-navigation-drawer
		expand-on-hover
		rail
		permanent
	>
		<v-list>
			<v-list-item
				:prepend-avatar="user.avatar"
				:title="user.firstName + ' ' + user.familyName"
				:subtitle="user.username"
				:to="{name:'profile'}"
			></v-list-item>
		</v-list>
		<v-divider></v-divider>
		<v-list
			class="navContent"
			>
			<v-list 
				nav
			>
				<v-list-item 
					:to="{name:'game'}"
					prepend-icon="mdi-controller" 
					title="Play PONG !" 
				></v-list-item>

				<v-list-item
					:to="{name:'chat'}"
					prepend-icon="mdi-chat"
					title="Community chat"
				></v-list-item>
			</v-list>
		</v-list>

		<v-list
			nav
		>
			<v-list-item
				:to="{name:'home'}"
				prepend-icon="mdi-logout"
				title="Logout"
			></v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>


<style>
.navContent {
	height: 90%;
}

.v-navigation-drawer {
	background-color: mediumaquamarine;
}

</style>