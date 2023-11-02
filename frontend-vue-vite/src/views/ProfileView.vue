<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

import NavSideBar from '../components/NavSideBar.vue'
import UserCard from '../components/Profile/UserCard.vue'
import MatchHistoryTable from '../components/Profile/MatchHistoryTable.vue'
import AddFriend from '@/components/Profile/AddFriend.vue'
import Friends from '../components/Profile/Friends.vue'
import Achievements from '../components/Profile/Achievements.vue'
import Notifications from '@/components/Profile/Notifications.vue'


const playerStore = usePlayerStore()
const { user, friends, fetchPlayer } = storeToRefs(playerStore)
const debug = false

export default {
	components : {
    NavSideBar, UserCard, MatchHistoryTable, AddFriend, Friends, Achievements,
    Notifications,
},
	data() {
		return {
			userVisitor: user.value,
			userVisitorFriends: friends,
			userProfile: {} as Player,
		}
	},
	computed: {
		visibility() : string {
			if (debug) console.log('| ProfileView | computed | visibility')
			let profileType = playerStore.visibility(this.userProfile.id);
			return profileType
		},
	},
	methods: {
		fetchUserProfile() {
			if (debug) console.log('| ProfileView | methods | fetchUserProfile()')
			let profileID : number = Number(this.$route.params.id)
			if (!profileID || profileID == this.userVisitor.id) {
				this.userProfile = this.userVisitor
			}
			else
				fetchPlayer.value(profileID)
					.then((targetUser : Player) => {
						this.userProfile = targetUser;
					})
					.catch((err : Error) => console.log(err))
		},
	},
	watch : {
		userVisitor(newValue : Player) {
			if (debug) console.log('| ProfileView | watch | userVisitor : new value : ' + newValue.username)
		},
		userVisitorFriends(newValue : Player[]) {
			if (debug) console.log('| ProfileView | watch | userVisitorFriends : new length : ' + newValue.length)
		},
		userProfile(newValue : Player) {
			if (debug) console.log('| ProfileView | watch | userProfile : new value : ' + newValue.username)
		},
	},
	
	beforeCreate() {
		if (debug) console.log('| ProfileView | beforeCreate()')
	},
	created() {
		if (debug) console.log('| ProfileView | created(' + (this.userProfile.id) + ')')
		this.fetchUserProfile()
	},
	beforeMount() {
		if (debug) console.log('| ProfileView | beforeMount(' + (this.userProfile.id) + ')')
	},
	mounted() {
		if (debug) console.log('| ProfileView | mounted(' + (this.userProfile.id) + ')')
	},
	beforeUpdate() {
		if (debug) console.log('| ProfileView | beforeUpdate(' + (this.userProfile.id) + ')')
		this.fetchUserProfile()
	},
	updated() {
		if (debug) console.log('| ProfileView | updated(' + (this.userProfile.id) + ')')
	},
	beforeUnmount() {
		if (debug) console.log('| ProfileView | beforeUnmount(' + (this.userProfile.id) + ')')
	},
	unmounted() {
		if (debug) console.log('| ProfileView | unmounted(' + (this.userProfile.id) + ')')
	},
}
</script>

<template>
	<div class="profile">
		<div class="justify-start">
		<NavSideBar />
		<!-- <v-app-bar density="compact" collapse  floating location="bottom"	 class="NavSideBar rounded-pill ma-2">
			<Notifications></Notifications>
		</v-app-bar> -->

		</div>

		<v-card class="parent">
			<div class="w-100 border d-flex justify-end align-end">
				<Notifications></Notifications>
			</div>
			<v-card class="child1">
			<v-card class="child2">
				<UserCard
					:userProfile="(userProfile as Player)"
				></UserCard>
			</v-card>
		</v-card>
		<v-card class="child1">
			<v-card
				class="child2"
				v-if="visibility === 'MyProfile' || visibility === 'FriendProfile'"
			>
				<Achievements
					:userProfile="(userProfile as Player)"
					v-if="visibility === 'MyProfile' || visibility === 'FriendProfile'"
				></Achievements>
				<Suspense><MatchHistoryTable
					:userProfile="(userProfile as Player)"
					v-if="visibility === 'MyProfile' || visibility === 'FriendProfile'"
				></MatchHistoryTable></Suspense>
			</v-card>
			<v-card class="child2"
				v-if="visibility === 'MyProfile'"
			>
				<AddFriend
					v-if="visibility == 'MyProfile'"
				></AddFriend>

				<Friends
					v-if="visibility == 'MyProfile'"
				></Friends>
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
