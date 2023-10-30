<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()

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
		// TODO reload ?
		// userProfile(newValue : Player){
		// 	this.fetchAchievements(newValue.id)
		// },
	},
    methods: {
		removeFromFriends(){
			this.loading = true
			setTimeout(() => {
				// axios.post(friendship/request)
				// if ok
				this.loading = false
				// push to reload the whole page to see the new state of the relationship
			}, 5000);
		},
		BlockUser(){
			this.loading = true
			setTimeout(() => {
				// axios.post(friendship/request)
				// if ok
				this.loading = false
				// push to reload the whole page to see the new state of the relationship
			}, 5000);
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
		title="View : Friend Profile"
	>
		<!-- v-if="`${userProfile.status}` === 'online'" -->
		<v-btn
			:text="'Play with ' + `${userProfile.firstName}`"
			to="/game"
			prepend-icon="mdi-controller"
			block
		>
		</v-btn>
		<!-- v-if="`${userProfile.status}` === 'online'" -->
		<v-btn
			:text="'Chat with ' + `${userProfile.firstName}`"
			to="/chat"
			prepend-icon="mdi-chat"
			block
		>
		</v-btn>
		<!-- v-if="`${userProfile.status}` === 'playing'" -->
		<v-btn
			:text="'Watch ' + `${userProfile.firstName}` + '\'s game'"
			to="/game"
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
			@click="BlockUser"
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