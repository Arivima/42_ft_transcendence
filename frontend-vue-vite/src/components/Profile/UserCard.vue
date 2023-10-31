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
			userVisitor: user.value as Player,
			userVisitorFriends: friends.value as Player[],
		}
	},
	computed: {
		visibility() : string {
			console.log('| UserCard | computed : visibility')
			let profileType = playerStore.visibility(this.userProfile.id);
			return profileType
		},
	},
	watch : {
		userVisitor(newValue : Player) {
			console.log('| UserCard | watch | userVisitor : new value : ' + newValue.username)
		},
		userVisitorFriends(newValue : Player[]) {
			console.log('| UserCard | watch | userVisitorFriends : new length : ' + newValue.length)
		},
		userProfile(newValue : Player) {
			console.log('| UserCard | watch | userProfile : new value : ' + newValue.username)
		},
	},
	methods: {
	},
	beforeCreate() {
		console.log('| UserCard | beforeCreate()')
	},
	created() {
		console.log('| UserCard | created()')
	},
	beforeMount() {
		console.log('| UserCard | beforeMount()')
	},
	mounted() {
		console.log('| UserCard | mounted()')
	},
	beforeUpdate() {
		console.log('| UserCard | beforeUpdate()')
	},
	updated() {
		console.log('| UserCard | updated()')
	},
	beforeUnmount() {
		console.log('| UserCard | beforeUnmount()')
	},
	unmounted() {
		console.log('| UserCard | unmounted()')
	},
}
</script>

<template>
	<p class="text-overline text-end mx-3 pa-0 "> {{ visibility }}</p>

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


<!-- <div class="d-flex flex-row justify-end align-start">
	<v-card class="pa-2 mx-3">
		<p class="text-overline">Profile : </p>
		<p class="text-caption">
			{{ userProfile.username }}
			| {{ userProfile.id }}
		</p>
	</v-card>
	<v-card class="pa-2 mx-3">
		<p class="text-overline">Visitor : </p>
		<p class="text-caption">
			{{ userVisitor.username }}
			| {{ userVisitor.id }}
		</p>

	</v-card>
</div> -->