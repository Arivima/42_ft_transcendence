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
			if (this.userVisitor.id == this.userProfile.id)
				return 'MyProfile'
			else if (this.userVisitorFriends.includes(this.userProfile))
				return 'FriendProfile'
			// TODO ADD BLOCKED USER
			else 
				return 'PublicProfile'
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
	<v-card class="containerContent component" image="cats.jpg" rounded="1" variant="tonal">

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
