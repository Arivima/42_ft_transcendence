<!-- PROFILE -->

<script setup lang="ts">
import NavSideBar from '../components/NavSideBar.vue'
import UserCard from '../components/Profile/UserCard.vue'
import MatchHistoryTable from '../components/Profile/MatchHistoryTable.vue'
import AddFriend from '@/components/Profile/AddFriend.vue'
import Friends from '../components/Profile/Friends.vue'
import Achievements from '../components/Profile/Achievements.vue'
</script>

<template>
	<div class="profile">
		<NavSideBar />
		<v-card class="parent">
			<v-card class="child1">
				<v-card class="child2">
					<UserCard />
				</v-card>
			</v-card>
			<v-card class="child1">
				<v-card class="child2">
					<Achievements />
					<Suspense><MatchHistoryTable /></Suspense>
					<!-- <MatchHistoryServer/>                 -->
				</v-card>
				<v-card class="child2">
					<AddFriend />
					<Friends />
				</v-card>
			</v-card>
		</v-card>
	</div>
</template>

<style scoped>
.parent {
	display: flex;
	flex-direction: column; /* x and y axis inverted */
	align-items: center; /* y axis */
	justify-content: start; /* x axis */
	justify-items: start; /* x axis */
	width: 100%;
	height: 100%;
}

.child1 {
	display: flex;
	flex-direction: row;
	align-items: start; /* y axis */
	align-content: start; /* y axis */
	justify-content: start; /* x axis */
	justify-items: start; /* x axis */
	width: 100%;
	height: 100%;
}

.child2 {
	display: flex;
	flex-direction: column; /* x and y axis inverted */
	align-items: stretch; /* y axis */
	align-content: center; /* y axis */
	justify-content: start; /* x axis */
	justify-items: center; /* x axis */
	width: 100%;
	height: 100%;
}
</style>
