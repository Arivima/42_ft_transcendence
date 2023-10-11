<!-- TODO
- overall size on the page
	+ responsiveness on the page resize / screens
- bigger avatar and icons
	+ update icon if necessary
- update router links
- script link to database to show user info
- add footer : 
	2023 ft_transcendence 42RomaLuiss
	link github team -->

<template>
	<v-navigation-drawer
		expand-on-hover
		rail
		permanent
	>

		<v-list>
			<RouterLink :to="{name:'profile'}">
				<v-list-item
					prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
					title="Username"
					subtitle="FirstName"
					value="profile"
				></v-list-item>
			</RouterLink>
		</v-list>

		<v-divider></v-divider>

		<v-list 
			density="comfortable" 
			nav
		>
			<RouterLink :to="{name:'game'}">
			<v-list-item 
				prepend-icon="mdi-controller" 
				title="Play Pong !" 
				value="game">
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


	</v-navigation-drawer>
</template>



		<!-- <v-footer> -->
        <!-- <v-list
			density="compact" 
			nav
		>
			<v-list-item target="_blank">ft_transcendence</v-list-item>
			<v-list-item href="https://github.com/Arivima/42_ft_transcendence" target="_blank">avilla-m</v-list-item>
			<v-list-item href="https://github.com/mmarinel/42RomaLuiss__ft_transcendence" target="_blank">mmarinel</v-list-item>
			<v-list-item href="https://github.com/ripa001/ft_transcendence" target="_blank">dripanuc</v-list-item>
			<v-list-item href="https://github.com/CCantale/ft_Transcendence" target="_blank">ccantal</v-list-item>
        </v-list> -->
      <!-- </v-footer> -->