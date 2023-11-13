<!-- GAME -->
<script lang="ts">
import Notifications from '@/components/Notifications.vue';
import NavSideBar from '../components/NavSideBar.vue'
import Customization from '@/components/Game/Customization.vue'
import Leaderboard from '@/components/Game/Leaderboard.vue'
import AboutGame from '@/components/Game/AboutGame.vue';
import DialogQueue from '@/components/Game/DialogQueue.vue';
import DialogEndGame from '@/components/Game/DialogEndGame.vue';
import CanvasGame from '@/components/Game/CanvasGame.vue';

export default {
	components : {
    NavSideBar, Notifications, Customization, Leaderboard, DialogQueue,
    AboutGame,
    DialogEndGame,
    CanvasGame
},
	data: () => ({
		newGame: false,
		inGame: true,
	}),
}
</script>

<template>
	<NavSideBar />
	<Notifications></Notifications>
	<AboutGame v-if="false == inGame"></AboutGame>
	<v-main>
		<v-card
			class="game flex-column backgroundGame"
		>
				<Leaderboard v-if="false == inGame"></Leaderboard>				
				<Customization v-if="false == inGame"></Customization>

		<v-card-item v-if="false == inGame"
			class="justify-center mt-7"
		>
			<v-btn
				color="primary"
				variant="elevated"
				size="x-large"
				@click="newGame = true"
			>
				Play now
				<DialogQueue></DialogQueue>
			</v-btn>
		</v-card-item>

		<v-card-item v-if="false == inGame"
			class="justify-center mt-7"
		>
			<v-btn
				color="primary"
				variant="tonal"
				size="x-large"
				@click="newGame = true"
			>
				test dialog end of game
				<DialogEndGame></DialogEndGame>
			</v-btn>
		</v-card-item>

		<CanvasGame v-if="inGame"></CanvasGame>


		</v-card>
	</v-main>
</template>

<style scoped>
.game {
	background-color: antiquewhite;
	height: 100%;
	width: 100%;
	outline: solid;
	display: flex;
	justify-content: center;
	justify-items: center;
	align-content: center;
	align-items: center;

}
.backgroundGame {
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(1.1);
    background: url(../../cats_ai.webp) no-repeat center center;
    background-size: cover;
}

.component {
	background-color: white;
}
</style>

