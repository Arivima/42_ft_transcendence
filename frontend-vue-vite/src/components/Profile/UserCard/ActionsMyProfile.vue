<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
import Dialog2FA from '../Dialog2FA.vue'
import DialogEdit from '../DialogEdit.vue'

const playerStore = usePlayerStore()
const { user } = storeToRefs(playerStore)

export default {
	components: {
		Dialog2FA,
		DialogEdit,
	},
    data () {
        return {
			user: user,
			loading: false,
        }
    },
    methods: {

	},
    mounted (){
    },
}
</script>

<template>
	<v-card
		class="itemActions itemActionsMyProfile"
		density="compact"
		variant="flat"
		width="fit-content"
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
		<v-btn value="editProfile" prepend-icon="mdi-pencil" class="ma-0 mb-1" block>
			Edit profile
			<DialogEdit></DialogEdit>
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