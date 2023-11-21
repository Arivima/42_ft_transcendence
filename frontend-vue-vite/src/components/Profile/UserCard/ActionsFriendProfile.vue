<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
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
	watch : {
	},
    methods: {
		removeFromFriends(){
			playerStore.sendFriendshipRejection(this.userProfile.id);
		},
		blockUser(){
			playerStore.toggleBlockUser(this.userProfile.id, true)
		},
		sendInviteToPlay(){
			playerStore.sendInvitation(this.userProfile.id)
		},
		streamUser(){
			playerStore.sendStreamingRequest(this.userProfile.id)
		},
	},
    mounted (){
    },
}
</script>

<template>
	<v-card
		class="itemActions itemActionsFriendProfile"
		density="compact"
		variant="flat"
	>
		<v-btn
			v-if="`${userProfile.status}` === 'online'"
			:text="'Play with ' + `${userProfile.firstName}`"
			@click="sendInviteToPlay"
			prepend-icon="mdi-controller"
			block
		>
		</v-btn>
		<v-btn
			:text="'Chat with ' + `${userProfile.firstName}`"
			to="/chat"
			prepend-icon="mdi-chat"
			block
		>
		</v-btn>
		<v-btn
			v-if="`${userProfile.status}` === 'playing'"
			:text="'Watch ' + `${userProfile.firstName}` + '\'s game'"
			@click="streamUser"
			prepend-icon="mdi-play"
			block
		>
		</v-btn>

		<v-btn
			:text="'Remove ' + `${userProfile.firstName}`"
			@click="removeFromFriends"
			prepend-icon="mdi-account-remove"
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