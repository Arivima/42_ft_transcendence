<!-- PROFILE -->

<!-- TODO
- link with database on all modules
- responsiveness on screen size
- position of cards on the page
-->

<script setup lang="ts">
import NavSideBar from '../components/NavSideBar.vue'
import UserCard from '../components/Profile/UserCard.vue'
import MatchHistoryTable from '../components/Profile/MatchHistoryTable.vue'
import MatchHistoryServer from '../components/WIP/MatchHistoryServer.vue'
import Friends from '../components/Profile/Friends.vue'
import Achievements from '../components/Profile/Achievements.vue'
import SearchBar from '../components/Utils/SearchBar.vue'
</script>

<template>
    <div class="profile">
        <NavSideBar/>
		<v-card
			class="parent"
		>
			<v-card
				class="child1 userCard"
			>
				<UserCard/>
			</v-card>
			<v-card
				class="child1"
			>
				<v-card
					class="child2"
				>
					<Achievements/>
					<MatchHistoryTable/>                
					<!-- <MatchHistoryServer/>                 -->
				</v-card>
				<!-- <SearchBar/> -->
				<Friends/>
			</v-card>
		</v-card>
    </div >
</template>


<style>
.parent {
	display:inline-flex;
	flex-direction: column;  /* x and y axis inverted */
	align-items: center;  /* y axis */
	justify-content: start; /* x axis */
	justify-items: start; /* x axis */
	background-color: plum;

	padding: 5%;
	min-height:1500px;
	min-width:1500px;
}

.child1 {
	display:inline-flex;
	flex-direction: row;
	padding: 5%;
	background-color: lightcoral;
}

.child2 {
	display:inline-flex;
	flex-direction: column;
	padding: 5%;
	background-color: yellow;
}

/* .userCard {
	background-image: url("saiyanBackground.jpeg");
} */
</style>
