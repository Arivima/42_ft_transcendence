<script lang="ts">
import { type Player, PlayerStatus } from '@/stores/PlayerStore'
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
        }
    },
	computed: {
		badgeColor() : string {
			if (debug) console.log('| Avatar | computed : badgeColor')
			if (this.userProfile.status == PlayerStatus.playing)
				return 'blue'
			else if (this.userProfile.status == PlayerStatus.online)
				return 'green'
			else
				return 'grey'
		},
		avatar() : string {
			if (debug) console.log('| Avatar | computed : avatar')
			return this.userProfile.avatar
		},
		username() : string {
			if (debug) console.log('| Avatar | computed : username')
			return this.userProfile.username
		},
	},
	watch : {
		userProfile(newValue : Player) {
			if (debug) console.log('| Avatar | watch | userProfile : new value : ' + newValue.username)
		},
	},
}
</script>

<template>
		<v-card class="itemAvatar" density="comfortable" variant="flat">
			<v-badge bordered inline :color="badgeColor" :content="userProfile.status">
				<v-avatar size="130" rounded="1">
					<v-img cover :src="avatar"></v-img>
				</v-avatar>
			</v-badge>
			<div class="backgroundItem ma-3">
				<v-card-item
					:title="username"
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