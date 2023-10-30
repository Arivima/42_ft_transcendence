<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { fetchPlayer } = storeToRefs(playerStore)

export default {
    data () {
        return {
			userProfile: {} as Player,
			loading: false,
			state: 'default'
        }
    },
    methods: {
		getUserProfile() {
			let Profileid : number = Number(this.$route.params.id)
			Profileid = 2 // TODO change when route update
			fetchPlayer.value(Profileid)
				.then((targetUser : Player) => {
					this.userProfile = targetUser;
				})
				.catch((err) => console.log(err))
		},
		addAsFriend(){
			this.loading = true
			setTimeout(() => {
				// axios.post(friendship/request)
				// if ok
				this.loading = false
				this.state = 'pending'
			}, 5000);
		},
	},
    mounted (){
		this.getUserProfile()
    },
}
</script>

<template>
	<!-- v-if="`${profile}` === 'PublicProfile'" -->
	<v-card
		class="itemActions itemActionsPublicProfile"
		density="compact"
		variant="flat"
		title="View : Public Profile"
	>
		<v-btn
			value="add"
			@click="addAsFriend"
			:text="state == 'pending'? 'Friendship request sent' : 'Ask ' + `${userProfile.firstName}` + ' as a friend'"
			prepend-icon="mdi-account-plus"
			:color="state == 'pending'? 'purple-lighten-4' : 'white'"
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