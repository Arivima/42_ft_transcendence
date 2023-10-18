<!-- Resources -->
<!-- https://vuetifyjs.com/en/components/badges/ -->
<!-- https://vuetifyjs.com/en/api/v-badge/#props -->

<script lang="ts">
	export default {
		data() {
			return {
				user: 
				{
					username: 'avilla-m',
					firstName: 'Arielle',
					familyName: 'Villa-Massone',
					status: 'online', /* playing | online | offline */
					avatar: 'https://avatar.iran.liara.run/public/94',
					my_friend: 1,
				},
				badgeColor: 'grey',
				enabled2fa: true,
				profile: 'FriendProfile', /* FriendProfile | MyProfile | PublicProfile */
				stats : {
					victories : 5,
					losses : 2,
					ladder : 2.5,
				}
			}
		},
		mounted () {
			if (this.user.status == 'online')
				this.badgeColor = 'green'
			else if (this.user.status == 'playing')
				this.badgeColor = 'blue'
			else
				this.badgeColor = 'grey'
		},
	}
</script>


<template>
	<v-card
		class="containerContent"
		image="saiyanBanner.jpg"
		rounded="0"
		variant="tonal"
	>


		<v-card
			class="itemAvatar"
			density="comfortable"
			variant="flat"
			>
			<v-badge bordered inline :color="badgeColor" :content="user.status">
				<v-avatar
					size="130"
					rounded="1"
				>
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



		<v-card
			class="itemStats"
			title="Stats"
			density="compact"
			variant="flat"
		>
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
				variant="tonal"
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
				variant="tonal"
				block
				>
			</v-btn>
			<v-btn
				value="chat"
				v-if="`${user.status}` === 'online'"
				:text="'Chat with ' + `${user.firstName}`"
				to="/chat"
				prepend-icon="mdi-chat"
				variant="tonal"
				block
				>
			</v-btn>
			<v-btn
				value="watch"
				v-if="`${user.status}` === 'playing'"
				:text="'Watch ' + `${user.firstName}` + '\'s game'"
				to="/game"
				prepend-icon="mdi-play"
				variant="tonal"
				block
				>
			</v-btn>

			<v-btn
				value="remove"
				:text="'Remove ' + `${user.firstName}`"
				to="/chat"
				prepend-icon="mdi-account-remove"
				variant="tonal"
				block
				>
			</v-btn>
			<v-btn
				value="block"
				:text="'Block ' + `${user.firstName}`"
				to="/chat"
				prepend-icon="mdi-account-cancel"
				variant="tonal"
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
				variant="tonal"
				block
				>
			</v-btn>
			<v-btn
				value="editAvatar"
				text="Edit avatar"
				to="/chat"
				prepend-icon="mdi-pencil"
				variant="tonal"
				block
				>
			</v-btn>
			<v-btn
				value="add2FA"
				v-if="`${enabled2fa}` === 'false'"
				text="Add 2FA"
				to="/chat"
				prepend-icon="mdi-shield-lock-outline"
				variant="tonal"
				block
				>
			</v-btn>
			<v-btn
				value="remove2FA"
				v-if="`${enabled2fa}` === 'true'"
				text="Remove 2FA"
				to="/chat"
				prepend-icon="mdi-shield-lock"
				variant="tonal"
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
	/* background-color: rgb(71, 59, 4); */

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

.v-btn {
	margin: 5px;
	justify-content: start;
	/* outline: solid; */
	min-height: fit-content;
	max-height: 20%;

}

.containerContent .v-btn__overlay {
	color: rgb(137, 4, 4);
}

.containerContent .v-btn__underlay {
	color: rgb(137, 4, 4);
}

.containerContent .v-card__underlay  {
	color: transparent;
}
</style>