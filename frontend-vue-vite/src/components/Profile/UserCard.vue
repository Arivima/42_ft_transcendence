<!-- Resources -->
<!-- https://vuetifyjs.com/en/components/badges/ -->
<!-- https://vuetifyjs.com/en/api/v-badge/#props -->

<script lang="ts">
import { usePlayerStore, PlayerStatus } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
import EditUserInfo from '../Utils/EditUserInfo.vue'
import Dialog2FA from './Dialog2FA.vue'
import DialogEdit from './DialogEdit.vue'

const { user } = storeToRefs(await usePlayerStore())
export default {
	components : {
		EditUserInfo, Dialog2FA, DialogEdit,
	},
	data() {
		return {
			user: user,
			badgeColor: 'grey',
			enabled2fa: true, /*TODO*/
			profile: 'MyProfile' /* FriendProfile | MyProfile | PublicProfile */,
			stats: {
				victories: 5,
				losses: 2,
				ladder: 2.5
			},
			dialogEdit: false,
		}
	},
	methods : {
	},
	mounted() {
		if (this.user.status == PlayerStatus.playing) this.badgeColor = 'blue'
		else if (this.user.status == PlayerStatus.online) this.badgeColor = 'green'
		else this.badgeColor = 'grey'
	}
}
</script>

<template>
	<v-card class="containerContent component" image="cats.jpg" rounded="1" variant="tonal">
		<v-card class="itemAvatar" density="comfortable" variant="flat">
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
		</v-card>

		<v-card class="itemStats backgroundItem" density="compact" variant="flat">
			<v-card-title class="text-overline">Stats</v-card-title>
			<v-card-item
				prepend-icon="mdi-trophy"
				:title="String(stats.victories)"
				subtitle="victories"
			>
			</v-card-item>

			<v-card-item
				class=""
				prepend-icon="mdi-trophy-broken"
				:title="String(stats.losses)"
				subtitle="losses"
			>
			</v-card-item>

			<v-card-item
				class=""
				prepend-icon="mdi-sword-cross"
				:title="String(stats.ladder)"
				subtitle="ladder lvl"
			>
			</v-card-item>
		</v-card>

			<!-- v-if="`${profile}` === 'PublicProfile'" -->
		<v-card
			class="itemActions itemActionsPublicProfile"
			density="compact"
			variant="flat"
			title="View : Public Profile"
		>
			<v-btn
				value="add"
				:text="'Add ' + `${user.firstName}` + 'as friend'"
				to="/game"
				prepend-icon="mdi-account-plus"
				block
			>
			</v-btn>
		</v-card>

			<!-- v-if="`${profile}` === 'FriendProfile'" -->
		<v-card
			class="itemActions itemActionsFriendProfile"
			density="compact"
			variant="flat"
			title="View : Friend Profile"
		>
				<!-- v-if="`${user.status}` === 'online'" -->
			<v-btn
				value="play"
				:text="'Play with ' + `${user.firstName}`"
				to="/game"
				prepend-icon="mdi-controller"
				block
			>
			</v-btn>
				<!-- v-if="`${user.status}` === 'online'" -->
			<v-btn
				value="chat"
				:text="'Chat with ' + `${user.firstName}`"
				to="/chat"
				prepend-icon="mdi-chat"
				block
			>
			</v-btn>
				<!-- v-if="`${user.status}` === 'playing'" -->
			<v-btn
				value="watch"
				:text="'Watch ' + `${user.firstName}` + '\'s game'"
				to="/game"
				prepend-icon="mdi-play"
				block
			>
			</v-btn>

			<v-btn
				value="remove"
				:text="'Remove ' + `${user.firstName}`"
				to="/chat"
				prepend-icon="mdi-account-remove"
				block
			>
			</v-btn>
			<v-btn
				value="block"
				:text="'Block ' + `${user.firstName}`"
				to="/chat"
				prepend-icon="mdi-account-cancel"
				block
			>
			</v-btn>
		</v-card>

			<!-- v-if="`${profile}` === 'MyProfile'" -->
		<v-card
			class="itemActions itemActionsMyProfile"
			density="compact"
			variant="flat"
			width="fit-content"
			title="View : My Profile"
		>
			<v-btn
				value="enable2FA"
				v-show="!user.twofaSecret"
				prepend-icon="mdi-shield-lock"
				class="ma-0 mb-1"
				block
			>
				Enable 2FA
				<Dialog2FA mode="enable"></Dialog2FA>
			</v-btn>
			<v-btn
				value="disable2FA"
				v-show="user.twofaSecret"
				prepend-icon="mdi-shield-remove-outline"
				class="ma-0 mb-1"
				block
			>
				Disable 2FA
				<Dialog2FA mode="disable"></Dialog2FA>
			</v-btn>
			<v-btn
				value="editProfile"
				prepend-icon="mdi-pencil"
				class="ma-0 mb-1"
				block
			>
				Edit profile
				<DialogEdit ></DialogEdit>
			</v-btn>
		</v-card>
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

.itemAvatar {
	display: flex;
	flex-direction: column;
	margin: 1%;
	padding: 1%;
	/* outline: solid; */
	/* background-color: aquamarine; */
	background-color: transparent;
}
.itemStats {
	display: flex;
	flex-direction: column;
	margin: 1%;
	padding: 1%;
	outline: solid;
	outline-color: antiquewhite;
	/* background-color: rgb(36, 176, 129); */
	background-color: transparent;
}
.itemActions {
	display: flex;
	flex-direction: column;
	margin: 1%;
	padding: 1%;
	/* outline: solid; */
	/* background-color: rgb(13, 114, 78); */
	background-color: transparent;
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

.itemAvatar .v-avatar {
	outline: solid;
	outline-color: antiquewhite;
}

.itemAvatar .v-badge__badge {
	color: antiquewhite !important;
}
</style>
