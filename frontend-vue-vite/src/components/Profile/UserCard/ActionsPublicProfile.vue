<script lang="ts">
import { usePlayerStore, PlayerStatus, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user, friends, publicUsers } = storeToRefs(playerStore)
const debug = false

export default {
	props: {
		userProfile: {
			type: Object as () => Player,
			required: true
		},
	},
    data () {
        return {
			loading: false,
        }
    },
	watch: {},
	computed: {
		pending() {
			return -1 == publicUsers.value.findIndex(
				(usr: Player) => this.userProfile.id == usr.id
			);
		}
	},
    methods: {
		toggleFriendshipRequest(){
			console.log(`addAsFriend: userProfile.id = ${this.userProfile.id}, typeof is: ${typeof this.userProfile.id}`)

			if (this.pending)
				playerStore.sendFriendshipRejection(Number(this.userProfile.id));
			else
				playerStore.sendFriendshipRequest(Number(this.userProfile.id));
		},
		blockUser(){
			playerStore.toggleBlockUser(this.userProfile.id, true)
		},
	},
    mounted (){
    },
}
</script>

<template>
	<v-card
		class="itemActions itemActionsPublicProfile"
		density="compact"
		variant="flat"
	>
		<v-btn
			value="add"
			@click="toggleFriendshipRequest"
			:text="pending? 'Cancel Friendship Request' : 'Ask ' + `${userProfile.firstName}` + ' as a friend'"
			prepend-icon="mdi-account-plus"
			:color="pending? 'purple-lighten-4' : 'white'"
			block
		>
		</v-btn>

		<v-btn
			:text="'Block ' + `${userProfile.firstName}`"
			@click="blockUser"
			prepend-icon="mdi-account-cancel"
			block
		>
		</v-btn>
	</v-card>
</template>

<style>
.itemActions {
	display: flex;
	flex-direction: column;
	margin: 1%;
	padding: 1%;
	/* outline: solid; */
	/* background-color: rgb(13, 114, 78); */
	background-color: transparent;
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