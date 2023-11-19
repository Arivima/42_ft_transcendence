<script lang="ts">
import Notifications from '@/components/Notifications.vue';
import NavSideBar from '../components/NavSideBar.vue'
import Customization from '@/components/Game/Customization.vue'
import Leaderboard from '@/components/Game/Leaderboard.vue'
import AboutGame from '@/components/Game/AboutGame.vue';
import DialogQueue from '@/components/Game/DialogQueue.vue';
import DialogEndGame from '@/components/Game/DialogEndGame.vue';
import CanvasGame from '@/components/Game/CanvasGame.vue';
import DialogWaiting from '@/components/Game/DialogWaiting.vue';

// import { user, currentGame } from '@/stores/PlayerStore';

export default {
	components : {
    NavSideBar, Notifications, Customization, Leaderboard, DialogQueue,
    AboutGame,
    DialogEndGame,
    CanvasGame,
    DialogWaiting
},
	data: () => ({
		inGame: false,
	}),
	methods: {
		closeGame(){
			this.inGame = false
		},
		newGame(){
			this.inGame = true
		}
	}
}
</script>

<!-- TODO About game should be linked to paused -->

<template>
	<NavSideBar />
	<Notifications></Notifications>
	<DialogWaiting></DialogWaiting>
	<AboutGame v-if="false == inGame"></AboutGame> 
	<v-main>
		<v-card
			class="game flex-column backgroundGame"
		>
			<Leaderboard v-if="false == inGame"></Leaderboard>				

			<v-card-item 
				class="ma-7"
			>
				<v-btn
					color="primary"
					variant="elevated"
					size="x-large"
					class="mx-3"
					@click="newGame"
				>
					Play now !
					<DialogQueue
						@close="closeGame"
					></DialogQueue>
				</v-btn>
			</v-card-item>

			<v-card-item
				v-if="true == inGame"
				class="text-center"
				style="font-weight: bolder; font-size:x-large;" prepend-icon="mdi-cat" append-icon="mdi-cat"
			>
				<h2>CAT PONG</h2>
			</v-card-item>

			<CanvasGame
				v-if="true == inGame"
				@close="closeGame"
			></CanvasGame>

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

