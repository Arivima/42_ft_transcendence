<!-- Resources -->
<!-- https://vuetifyjs.com/en/components/badges/ -->
<!-- https://vuetifyjs.com/en/api/v-badge/#props -->

<script lang="ts">
import jwt_decode from 'jwt-decode'

//TODO
//1. clean code (maybe use $store ? + create JWT interface)
export default {
	data() {
		return {
			decoded_jwt: jwt_decode(localStorage.getItem('token') || '') || '',
			user: {
				username: jwt_decode(localStorage.getItem('token') || '')?.username || 'NaN',
				firstName: jwt_decode(localStorage.getItem('token') || '')?.firstName || 'NaN',
				familyName: jwt_decode(localStorage.getItem('token') || '')?.familyName || 'NaN',
				status: 'playing' /* playing | online | offline */,
				avatar: jwt_decode(localStorage.getItem('token') || '')?.avatar || 'NaN',
				my_friend: 1
			},
			badgeColor: 'grey',
			enabled2fa: false,
			profile: 'FriendProfile' /* FriendProfile | MyProfile | PublicProfile */,
			stats: {
				victories: 5,
				losses: 2,
				ladder: 2.5
			}
		}
	},
	mounted() {
		if (this.user.status == 'online') this.badgeColor = 'green'
		else if (this.user.status == 'playing') this.badgeColor = 'blue'
		else this.badgeColor = 'grey'
	}
}
</script>

<template>
	<v-card class="containerCard">
		<!-- <v-img
			height="100%"
			cover
			src="saiyanBanner.jpg"
		> -->
		<div class="containerContent">
			<v-card class="itemAvatar" density="compact">
				<v-badge bordered inline :color="badgeColor" :content="user.status">
					<v-avatar size="130" rounded="1">
						<v-img cover :src="user.avatar"></v-img>
					</v-avatar>
				</v-badge>

				<v-card-item
					class="text-black"
					:title="user.username"
					:subtitle="user.firstName + ' ' + user.familyName"
				>
				</v-card-item>
			</v-card>

			<v-card class="itemStats" title="Stats" density="compact">
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
				title="Public Profile View"
			>
				<v-btn value="add" prepend-icon="mdi-account-plus" variant="tonal" block>
					Add {{ user.firstName }} as friend
				</v-btn>
			</v-card>
			<v-card
				class="itemActions itemActionsFriendProfile"
				v-if="`${profile}` === 'FriendProfile'"
				density="compact"
				title="Friend Profile View"
			>
				<v-btn
					value="play"
					v-if="`${user.status}` === 'online'"
					prepend-icon="mdi-controller"
					variant="tonal"
					block
				>
					Play with {{ user.firstName }}
				</v-btn>
				<v-btn
					value="chat"
					v-if="`${user.status}` === 'online'"
					prepend-icon="mdi-chat"
					variant="tonal"
					block
				>
					Chat with {{ user.firstName }}
				</v-btn>
				<v-btn
					value="watch"
					v-if="`${user.status}` === 'playing'"
					prepend-icon="mdi-play"
					variant="tonal"
					block
				>
					Watch {{ user.firstName }}'s game
				</v-btn>
				<v-btn value="remove" prepend-icon="mdi-account-remove" variant="tonal" block>
					Remove {{ user.firstName }}
				</v-btn>
				<v-btn value="block" prepend-icon="mdi-account-cancel" variant="tonal" block>
					Block {{ user.firstName }}
				</v-btn>
			</v-card>

			<v-card
				class="itemActions itemActionsMyProfile"
				v-if="`${profile}` === 'MyProfile'"
				density="compact"
				title="My Profile View"
			>
				<v-btn value="editUsername" prepend-icon="mdi-pencil" variant="tonal" block>
					Edit username
				</v-btn>
				<v-btn value="editAvatar" prepend-icon="mdi-pencil" variant="tonal" block>
					Edit avatar
				</v-btn>
				<v-btn
					value="add2FA"
					v-if="`${enabled2fa}` === 'false'"
					prepend-icon="mdi-shield-lock-outline"
					variant="tonal"
					block
				>
					Add 2FA
				</v-btn>
				<v-btn
					value="remove2FA"
					v-if="`${enabled2fa}` === 'true'"
					prepend-icon="mdi-shield-lock"
					variant="tonal"
					block
				>
					Remove 2FA
				</v-btn>
			</v-card>
		</div>
		<!-- </v-img> -->
	</v-card>
</template>

<style>
.containerCard {
	height: 100%;
	width: 100%;
	margin: 1%;
	padding: 1%;
	height: fit-content;
	outline: solid;
	background-color: rgb(82, 69, 7);
}

.containerContent {
	display: flex;
	flex-direction: row;
	align-content: start;
	align-items: stretch;
	justify-content: space-between;
	justify-items: stretch;
	height: 100%;
	width: 100%;
	margin: 1%;
	padding: 1%;
	outline: solid;
	background-color: rgb(230, 202, 75);
}

.itemAvatar {
	display: flex;
	flex-direction: column;
	margin: 1%;
	padding: 1%;
	outline: solid;
	background-color: aquamarine;
}
.itemStats {
	display: flex;
	flex-direction: column;
	margin: 1%;
	padding: 1%;
	outline: solid;
	background-color: rgb(36, 176, 129);
}
.itemActions {
	display: flex;
	flex-direction: column;
	margin: 1%;
	padding: 1%;
	outline: solid;
	background-color: rgb(13, 114, 78);
}

.v-btn {
	margin: 3px;
}
</style>
