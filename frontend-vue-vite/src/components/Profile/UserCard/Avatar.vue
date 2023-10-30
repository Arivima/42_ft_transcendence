<script lang="ts">
import { usePlayerStore, type Player, PlayerStatus } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { fetchPlayer } = storeToRefs(playerStore)

export default {
    data () {
        return {
			badgeColor: 'grey',
			userProfile: {} as Player,

        }
    },
    methods: {
		getUserProfile() {
			let Profileid : number = Number(this.$route.params.id)
			Profileid = 99696 // TODO change when route update
			fetchPlayer.value(Profileid)
				.then((targetUser : Player) => {
					this.userProfile = targetUser;
					this.setBadgeColor()
				})
				.catch((err) => console.log(err))
		},
        setBadgeColor(){
			if (this.userProfile.status == PlayerStatus.playing) this.badgeColor = 'blue'
			else if (this.userProfile.status == PlayerStatus.online) this.badgeColor = 'green'
			else this.badgeColor = 'grey'
        },
	},
    mounted (){
		this.getUserProfile()
    },
}
</script>

<template>
		<v-card class="itemAvatar" density="comfortable" variant="flat">
			<v-badge bordered inline :color="badgeColor" :content="userProfile.status">
				<v-avatar size="130" rounded="1">
					<v-img cover :src="userProfile.avatar"></v-img>
				</v-avatar>
			</v-badge>
			<div class="backgroundItem ma-3">
				<v-card-item
					:title="userProfile.username"
					:subtitle="userProfile.firstName + ' ' + userProfile.lastName"
				>
				</v-card-item>
			</div>
		</v-card>

</template>

<style>
.itemAvatar {
	display: flex;
	flex-direction: column;
	margin: 1%;
	padding: 1%;
	/* outline: solid; */
	/* background-color: aquamarine; */
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

.itemAvatar .v-avatar {
	outline: solid;
	outline-color: antiquewhite;
}

.itemAvatar .v-badge__badge {
	color: antiquewhite !important;
}
</style>