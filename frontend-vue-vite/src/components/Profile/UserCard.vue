<!-- Resources -->
<!-- https://vuetifyjs.com/en/components/badges/ -->
<!-- https://vuetifyjs.com/en/api/v-badge/#props -->

<script lang="ts">
import { usePlayerStore, PlayerStatus } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const { user } = storeToRefs(await usePlayerStore())
export default {
	data() {
		return {
			user: user,
			badgeColor: 'grey',
			enabled2fa: true,
			profile: 'FriendProfile' /* FriendProfile | MyProfile | PublicProfile */,
			stats: {
				victories: 5,
				losses: 2,
				ladder: 2.5
			}
		}
	},
	mounted() {
		if (this.user.status == PlayerStatus.playing) this.badgeColor = 'blue'
		else if (this.user.status == PlayerStatus.online) this.badgeColor = 'green'
		else this.badgeColor = 'grey'
	}
}
</script>

<template>
	<v-card class="containerContent" image="saiyanBanner.jpg" rounded="0" variant="tonal">
		<v-card class="itemAvatar" density="comfortable" variant="flat">
			<v-badge bordered inline :color="badgeColor" :content="user.status">
				<v-avatar size="130" rounded="1">
					<v-img cover :src="user.avatar"></v-img>
				</v-avatar>
			</v-badge>
			<div class="backgroundItem ma-3">
				<v-card-item
					class="text-black"
					:title="user.username"
					:subtitle="user.firstName + ' ' + user.lastName"
				>
				</v-card-item>
			</div>
		</v-card>

		<v-card class="itemStats backgroundItem" title="Stats" density="compact" variant="flat">
			<v-card-item
				class=""
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

		<v-card
			class="itemActions itemActionsPublicProfile"
			v-if="`${profile}` === 'PublicProfile'"
			density="compact"
			variant="flat"
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

		<v-card
			class="itemActions itemActionsFriendProfile"
			v-if="`${profile}` === 'FriendProfile'"
			density="compact"
			variant="flat"
		>
			<v-btn
				value="play"
				v-if="`${user.status}` === 'online'"
				:text="'Play with ' + `${user.firstName}`"
				to="/game"
				prepend-icon="mdi-controller"
				block
			>
			</v-btn>
			<v-btn
				value="chat"
				v-if="`${user.status}` === 'online'"
				:text="'Chat with ' + `${user.firstName}`"
				to="/chat"
				prepend-icon="mdi-chat"
				block
			>
			</v-btn>
			<v-btn
				value="watch"
				v-if="`${user.status}` === 'playing'"
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

		<v-card
			class="itemActions itemActionsMyProfile"
			v-if="`${profile}` === 'MyProfile'"
			density="compact"
			variant="flat"
		>
			<v-btn
				value="editUsername"
				text="Edit username"
				to="/chat"
				prepend-icon="mdi-pencil"
				block
			>
			</v-btn>
			<v-btn value="editAvatar" text="Edit avatar" to="/chat" prepend-icon="mdi-pencil" block>
			</v-btn>
			<v-btn
				value="add2FA"
				v-if="`${enabled2fa}` === 'false'"
				text="Add 2FA"
				to="/chat"
				prepend-icon="mdi-shield-lock-outline"
				block
			>
			</v-btn>
			<v-btn
				value="remove2FA"
				v-if="`${enabled2fa}` === 'true'"
				text="Remove 2FA"
				to="/chat"
				prepend-icon="mdi-shield-lock"
				block
			>
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
	margin: 1%;
	padding: 1%;
	outline: solid;
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
	/* outline: solid; */
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
	/* outline: solid; */
	min-height: fit-content;
	max-height: 20%;
	/* color: blue; */
	/* background-color: white; */
}

.containerContent .v-card__underlay {
	color: transparent;
}

.backgroundItem {
	background-color: rgba(255, 255, 255, 0.41);
	color: black;
	border-radius: 30px; /*Increase or decrease the value for controlling the roundness*/
	width: fit-content;
}
</style>
