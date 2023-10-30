<script lang="ts">
import { usePlayerStore, PlayerStatus, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

import Notifications from './Notifications.vue'
import Avatar from './UserCard/Avatar.vue'
import Stats from './UserCard/Stats.vue'
import ActionsPublicProfile from './UserCard/ActionsPublicProfile.vue'
import ActionsFriendProfile from './UserCard/ActionsFriendProfile.vue'
import ActionsMyProfile from './UserCard/ActionsMyProfile.vue'

const playerStore = usePlayerStore()
const { user, friends, fetchPlayer } = storeToRefs(playerStore)

export default {
	components: {
		Notifications,
		Avatar,
		Stats,
		ActionsPublicProfile,
		ActionsFriendProfile,
		ActionsMyProfile,
	},
	data() {
		return {
			// badgeColor: 'grey',
			// profile: 'MyProfile' /* FriendProfile | MyProfile | PublicProfile */,
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
		},
	},
	async mounted() {
		this.getUserProfile()

		// if (this.user.status == PlayerStatus.playing) this.badgeColor = 'blue'
		// else if (this.user.status == PlayerStatus.online) this.badgeColor = 'green'
		// else this.badgeColor = 'grey'
	}
}
</script>

<template>
	<v-card class="containerContent component" image="cats.jpg" rounded="1" variant="tonal">
		<!-- <v-card class="itemAvatar" density="comfortable" variant="flat">
			<v-badge bordered inline :color="badgeColor" :content="user.status">
				<v-avatar size="130" rounded="1">
					<v-img cover :src="user.avatar"></v-img>
				</v-avatar>
			</v-badge>
			<div class="backgroundItem ma-3">
				<v-card-item
					:title="user.username"
					:subtitle="user.firstName + ' ' + user.lastName"
				>
				</v-card-item>
			</div>
		</v-card> -->

		<Avatar></Avatar>
		<Stats></Stats>

			<!-- v-show="visibility == 'PublicProfile'" -->
			<!-- v-show="visibility == 'FriendProfile'" -->
			<!-- v-show="visibility == 'MyProfile'" -->
		<ActionsPublicProfile
		></ActionsPublicProfile>
		<ActionsFriendProfile
		></ActionsFriendProfile>
		<ActionsMyProfile
		></ActionsMyProfile>
		<!-- ADD BLOCKED PROFILE -->

		<!-- // TODO -->
		<Notifications v-show="visibility == 'MyProfile'"></Notifications>

	</v-card>
</template>

<style>
.containerContent {
	display: flex;
	flex-direction: row;
	align-content: start;
	/* align-items: stretch; */
	justify-content: space-between;
	/* justify-items: stretch; */
	/* height: 100%; */
	/* width: 100%; */
}

.containerContent .v-btn {
	margin: 5px;
	justify-content: start;
	min-height: fit-content;
	max-height: 20%;
	outline: solid;
	outline-color: antiquewhite;
	/* color: blue; */
	/* background-color: white; */
}

.containerContent .v-card__underlay {
	color: transparent;
}

.backgroundItem {
	background-color: rgba(255, 255, 255, 0.497);
	color: black;
	border-radius: 30px; /*Increase or decrease the value for controlling the roundness*/
	width: fit-content;
	outline: solid;
	outline-color: antiquewhite;
}
</style>
