<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

import NavSideBar from '../components/NavSideBar.vue'
import UserCard from '../components/Profile/UserCard.vue'
import MatchHistoryTable from '../components/Profile/MatchHistoryTable.vue'
import AddFriend from '@/components/Profile/AddFriend.vue'
import Friends from '../components/Profile/Friends.vue'
import Achievements from '../components/Profile/Achievements.vue'


const playerStore = usePlayerStore()
const { user, friends, fetchPlayer } = storeToRefs(playerStore)

export default {
	components : {
		NavSideBar, UserCard, MatchHistoryTable, AddFriend, Friends, Achievements
	},
	data() {
		return {
			userVisitor: user.value,
			userVisitorFriends: friends,
			userProfile: {} as Player,
			visibility: '', // ('MyProfile' | 'FriendProfile' | 'PublicProfile' | 'BlockedProfile')
		}
	},
	methods: {
		getUserProfile() {
			let Profileid : number = Number(this.$route.params.id)
			Profileid = 99696 // TODO change when route update
			fetchPlayer.value(Profileid)
				.then((targetUser : Player) => {
					this.userProfile = targetUser;
					this.setVisibility()
				})
				.catch((err) => console.log(err))
		},
		setVisibility() {
			console.log('userVisitor : ' + this.userVisitor.id)
			console.log('userProfile : ' + this.userProfile.id)

			if (this.userVisitor.id == this.userProfile.id)
				this.visibility = 'MyProfile'
			else if (this.userVisitorFriends.includes(this.userProfile))
				this.visibility = 'FriendProfile'
			// TODO ADD BLOCKED USER
			else 
				this.visibility = 'PublicProfile'

			console.log('VISIBILITY : ' + this.visibility)
		}
	},
	mounted() {
		this.getUserProfile()
	},
}
</script>

<template>
	<div class="profile">
		<!-- <NavSideBar /> -->
			<v-card class="parent">
				<p class="text-overline">Visibility : {{ visibility }}</p>
				<div class="d-flex flex-row justify-space-between align-start">
					<v-card class="pa-2 mx-3">
						<p class="text-overline">Profile : </p>
						<p class="text-caption">
							{{ userProfile.username }}
							| {{ userProfile.id }}
							| {{ userProfile.firstName }}
							| {{ userProfile.lastName }}
						</p>
					</v-card>
					<v-card class="pa-2 mx-3">
						<p class="text-overline">Visitor : </p>
						<p class="text-caption">
							{{ userVisitor.username }}
							| {{ userVisitor.id }}
							| {{ userVisitor.firstName }}
							| {{ userVisitor.lastName }}
						</p>
					</v-card>
				</div>
				<v-card class="child1">
				<v-card class="child2">
					<UserCard />
				</v-card>
			</v-card>
			<v-card class="child1">
				<v-card class="child2">
					<Achievements
						v-if="visibility == ('MyProfile' || 'FriendProfile')"
					></Achievements>
					<Suspense><MatchHistoryTable
						v-if="visibility == ('MyProfile' || 'FriendProfile')"
					></MatchHistoryTable></Suspense>
				</v-card>
				<v-card class="child2">
					<AddFriend
						v-if="visibility == 'MyProfile'"
					></AddFriend>
					<Friends
						v-if="visibility == ('MyProfile' || 'FriendProfile')"
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
