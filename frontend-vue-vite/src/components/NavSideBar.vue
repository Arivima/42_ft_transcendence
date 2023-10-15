<!-- TODO
- overall size on the page
- bigger avatar and icons
- script link to database to show user info
-->

<template>
	<v-navigation-drawer
		expand-on-hover
		rail
		permanent
	>
		<v-list
		>	<RouterLink :to="{name:'profile'}">
				<v-list-item
					prepend-avatar="https://avatar.iran.liara.run/public/68"
					title="firstName"
					subtitle="Username"
					value="profile"
				></v-list-item>
			</RouterLink>
		</v-list>

		<v-divider></v-divider>

		<v-list 
			density="compact" 
			nav
		>
			<RouterLink :to="{name:'game'}">
				<v-list-item 
					prepend-icon="mdi-controller" 
					title="Play PONG !" 
					value="game"
				>
				</v-list-item>
			</RouterLink>

			<RouterLink :to="{name:'chat'}">
				<v-list-item
					prepend-icon="mdi-chat"
					title="Community chat"
					value="chat">
				</v-list-item>
			</RouterLink>
		</v-list>


		<v-spacer></v-spacer>

		<v-container class="pa-0 ma-0">
			<v-list
				density="comfortable" 
				nav
			>
			<RouterLink :to="{name:'home'}">
					<v-list-item
						prepend-icon="mdi-logout"
						title="Logout"
						value="logout">
					</v-list-item>
				</RouterLink>
			</v-list>
		</v-container>
	</v-navigation-drawer>
</template>


<style>
.v-list-item{
  color: var(--color-text);
}
</style>