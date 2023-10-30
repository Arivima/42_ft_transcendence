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
const { user, friends } = storeToRefs(playerStore)

export default {
	components: {
		Notifications,
		Avatar,
		Stats,
		ActionsPublicProfile,
		ActionsFriendProfile,
		ActionsMyProfile,
	},
	props: {
		userProfile: {
			type: Object as () => Player,
			required: true
		},
	},
	data() {
		return {
			userVisitor: user.value,
			userVisitorFriends: friends,
		}
	},
	computed: {
		visibility() : string {
			console.log('userVisitor id: ' + this.userVisitor.id )
			console.log('userProfile id: ' + this.userProfile.id )
			console.log('typeof userVisitor : ' + this.userVisitor)
			console.log('typeof userProfile : ' + this.userProfile)
			console.log('typeof userVisitorFriends : ' + this.userVisitorFriends)
			console.log('typeof userVisitorFriends[0] : ' + this.userVisitorFriends[0])
			console.log('are friends : ' + this.userProfile.my_friend)
			console.log('are friends : ' + this.userProfile.my_friend)
			
			let profileType = '';
			if (this.userVisitor.id == this.userProfile.id)
				profileType = 'MyProfile'
			else if (this.userVisitorFriends[this.userProfile.id] )
				profileType = 'FriendProfile'
			// TODO ADD BLOCKED USER
			else 
				profileType = 'PublicProfile'
			return profileType
		},
	},
	watch : {
		// TODO ?
		// 	userProfile(newValue : Player){
		// 		this.fetchAchievements(newValue.id)
		// 	},
	},
	methods: {
	},
	async mounted() {
	}
}
</script>

<template>
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
				| {{ userVisitorFriends }}
			</p>
		</v-card>
	</div>
	<v-card
		class="containerContent component"
		image="cats.jpg"
		rounded="1"
		variant="tonal"
	>

		<Avatar
			:userProfile="userProfile"
		></Avatar>

		<Stats
			:userProfile="userProfile"
		></Stats>

		<ActionsPublicProfile
			:userProfile="userProfile"
			v-if="visibility == 'PublicProfile'"
		></ActionsPublicProfile>

		<ActionsFriendProfile
			:userProfile="userProfile"
			v-if="visibility == 'FriendProfile'"
		></ActionsFriendProfile>

		<ActionsMyProfile
			v-if="visibility == 'MyProfile'"
		></ActionsMyProfile>

		<!-- ADD BLOCKED PROFILE -->

		<!-- // TODO -->
		<Notifications v-if="visibility == 'MyProfile'"></Notifications>

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
