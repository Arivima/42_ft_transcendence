<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

import NavSideBar from '../components/NavSideBar.vue'
import Notifications from '@/components/Notifications.vue'
import UserCard from '../components/Profile/UserCard.vue'
import MatchHistoryTable from '../components/Profile/MatchHistoryTable.vue'
import AddFriend from '@/components/Profile/AddFriend.vue'
import Friends from '../components/Profile/Friends.vue'
import Achievements from '../components/Profile/Achievements.vue'
import BlockedUsers from '@/components/Profile/BlockedUsers.vue'
import BlockedSent from '@/components/Profile/BlockedSent.vue'


const playerStore = usePlayerStore()
const { user, friends, fetchPlayer } = storeToRefs(playerStore)
const debug = false

export default {
	components : {
    NavSideBar, UserCard, MatchHistoryTable, AddFriend, Friends, Achievements,
    Notifications,
    BlockedSent
},
	data() {
		return {
			userVisitor: user.value,
			userVisitorFriends: friends,
			userProfile: undefined as Player | undefined,
		}
	},
	computed: {
		visibility() : string {
			if (debug) console.log('| ProfileView | computed | visibility')
			let profileType = playerStore.visibility(this.userProfile?.id);
			return profileType
		},
	},
	methods: {
		async fetchUserProfile() {
			let profileID : number = Number(this.$route.params.id)
			if (debug) console.log(`| ProfileView | methods | fetchUserProfile() | ${profileID}`)

			if (!profileID || profileID == this.userVisitor.id) {
				if (debug) console.log(`Visitor and userProfile are the same`)
				this.userProfile = this.userVisitor;
			}
			else {
				try {
					this.userProfile = await fetchPlayer.value(profileID);
					if (debug) console.log(`{\
						userprofileID: ${this.userProfile?.id},\
						userprofileUsername: ${this.userProfile?.username},\
						userprofileAvatar: ${this.userProfile?.avatar},\
					}`)
				}
				catch (err) {
					console.log(`Cannot view selected user profile`);
					this.$router.push({name: 'profile'});
				}
			}
			if (debug) console.log(`| ProfileView | methods | fetchUserProfile() | END`)
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
	async created() {
		if (debug) console.log('| ProfileView | created(' + (this.userProfile?.id) + ')')
		// try {
			await this.fetchUserProfile()
		// }
		// catch (_) {
		// 	this.$router.push({name: 'profile'});
		// }
	},
	beforeMount() {
		if (debug) console.log('| ProfileView | beforeMount(' + (this.userProfile?.id) + ')')
	},
	mounted() {
		if (debug) console.log('| ProfileView | mounted(' + (this.userProfile?.id) + ')')
		// this.fetchUserProfile();
	},
	beforeUpdate() {
		if (debug) console.log('| ProfileView | beforeUpdate(' + (this.userProfile?.id) + ')')
		try {
			this.fetchUserProfile()
		}
		catch (_) {
			this.$router.push({name: 'profile'});
		}
	},
	updated() {
		if (debug) console.log('| ProfileView | updated(' + (this.userProfile?.id) + ')')
	},
	beforeUnmount() {
		if (debug) console.log('| ProfileView | beforeUnmount(' + (this.userProfile?.id) + ')')
	},
	unmounted() {
		if (debug) console.log('| ProfileView | unmounted(' + (this.userProfile?.id) + ')')
	},
}
</script>

<template>
<div class="profile">
	<NavSideBar />
	<Notifications />
	<!-- <v-main> -->
		<v-card class="parent">
			<v-card class="child1">
				<v-card class="child2">
					<UserCard v-if="userProfile"
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
					<BlockedSent
						v-if="visibility == 'MyProfile'"
					></BlockedSent>
				</v-card>
			</v-card>
		</v-card>
	<!-- </v-main> -->
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
