<script lang="ts">

/**
 * COSE DA FARE
 * 
 * 1. spostare lo stato del game nello store? : se lo faccio, probabilmente posso andare su un'altra pagina mentre sto giocando e mantenere la sessione di gioco
 * 		1.1 i web socket continueranno comunque ad aggiornare il gioco
 * 		1.2 i miei event listener su input utente saranno disabilitati
 * 		1.3 la mia paddle resterá ferma
 * 		1.4 se perdo mentre sono fuori, quando rientro vedo la schermata di fine gioco.
 * 
 * 2. fare una funzione che in base allo stato (gameConf), fa il clear del canvas e ridisegna il prossimo frame
 
 * 3. gestire gli event listener in questo file: forse é meglio mouse move, dove la coordinata del mouse mi dice se devo spostare il paddle sotto o sopra
 * 	3.1 magari solo quando sono nella mia metá campo
 *  3.2 magari guardando la coordinata y del mouse, se > di quella del paddle, il paddle va su, altrimenti giu
 *  3.3 idee migliori sono bene accette
 * 
 * 4. gestire le dimensioni : sia del canvas relativo alla intera window, sia degli oggetti (paddle, ball, etc.) relativamente al canvas
 * 		4.1 - il relativo  puó essere in % o in altre unitá di misura
 * 		4.2 soluzioni efficienti sono bene accette
 * 
 * 5. gestire il resize del canvas
 *	5.1 quando faccio il resize della finestra, il canvas cambia di dimensione e di conseguenza devono cambiare di dimensione
*	5.2 tutti quegli oggetti la cui dimensione dipende dal canvas

 * 6. gestire bene gli event listeners
 * 
 * 7. la parte di socket verrá dopo, adesso quello che é estremamente importante é avere una rappresentazione facilmente maneggiabile dello stato
 * 		7.1 fatta bene per future estensioni
 * 		7.2 fatta bene per poter integrare il canvas in piú parti della applicazione
 * 
 * 8. power-ups: different maps (per iniziare colori diversi), paddle height aumenta se fai punti, etc.
 */

//  const requestAnimationFrame =
//   window.requestAnimationFrame ||
//   window.mozRequestAnimationFrame ||
//   window.webkitRequestAnimationFrame ||
//   window.msRequestAnimationFrame;


// const cancelAnimationFrame =
//   window.cancelAnimationFrame || window.mozCancelAnimationFrame;

import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user } = storeToRefs(playerStore)

const debug = true

export interface PlayerConf {
	id: number,
	paddleWidth: number,
	paddleHeight: number,
	paddlePos: {x: number, y: number}
}

export interface BallConf {
	start: {x: number, y: number},
	pos: {x: number, y: number},
	dir: {x: number, y: number},
	radius: number,
	color: string,
}

export interface GameConf {
	host: PlayerConf,
	guest: PlayerConf,
	ball : BallConf,
	pitchLineWidth: number,
	pitchCirclePos: {x: number, y: number},
	pitchCircleRadius: Number,
	// paddleColor: string,
	// pitchColor: string,
}

export interface GameState {
	// host: PlayerConf,
	// guest: PlayerConf,
	// ball : BallConf,
	// pitchLineWidth: number,
	// pitchCirclePos: {x: number, y: number},
	// pitchCircleRadius: Number,
	// // paddleColor: string,
	// // pitchColor: string,
}

const emptyConf = {
	host: {
		id: 0,
		paddleHeight: 0,
		paddlePos: {x: 0, y: 0},
		paddleWidth: 0,
	},
	guest: {
		id: 0,
		paddleHeight: 0,
		paddlePos: {x: 0, y: 0},
		paddleWidth: 0,
	},
	ball : {
		start: {x: 0, y: 0},
		pos: {x: 0, y: 0},
		dir: {x: 0, y: 0},
		radius: 0,
		color: 'purple'
	},
	pitchLineWidth: 0,
	pitchCirclePos: {x: 0, y: 0},
	pitchCircleRadius: 0
}

// ball speed
// update frequency


export default {
	components:	{
	},
	props: {
	},
	emits : [
		'close'
	],
	data: () => ({
			// conf
			user : user.value,
			opponent : {} as Player,
			canvas_old_width: 0,
			canvas_old_height: 0,
			canvas : null as HTMLCanvasElement | null, // CHECK HERE TODO
			ccontext: null as CanvasRenderingContext2D | null, // CHECK HERE TODO
			gameConf: emptyConf,
			// state
			clock: true,
			paused: false,
			keyState: new Map<string, Boolean>([
				['ArrowUp', false], ['ArrowDown', false], [' ', false]
			]),
			score : {host : 0, guest : 0},



			deltaTime: 0,
			lastTimeStamp: 0,
			step: 1000/150,

			hostPaddleDis: 0,
			guestPaddleDis: 0,

			ballDisY: 0,
			ballDisX: 0,

			ballDirX: 1,
			ballDirY: 1,
	}),
	watch : {
		gameState(newVal: 'Start' | 'Play' | 'Pause' | 'End') {
			if (debug) console.log("Game state : " + newVal)
		},
	},
	computed : {
		userIsHost() : boolean {
			return (this.gameConf.host.id == this.user.id)
		},
		userIsGuest() : boolean {
			return (this.gameConf.host.id != this.user.id)
		},
		hostWon() : boolean {
			return (this.score.host == 10)
		},
		guestWon() : boolean {
			return (this.score.guest == 10)
		},
		userWon() : boolean {
			return (this.userIsHost && this.hostWon) || (this.userIsGuest && this.guestWon) 
		},
		userLost() : boolean {
			return (!this.userWon)
		},
		// TODO
		end(){
			return (this.hostWon || this.guestWon);
		},
		gameState(): 'Start' | 'Play' | 'Pause' | 'End' {
			return (
				this.paused ? 'Pause' : 
				this.end ? 'End' :
				this.clock ? 'Play' :  
				'Start');
		},
		AbsPaddleHost() : {x: number, y: number} {
			return ({
				x : this.gameConf.host.paddlePos.x, 
				y : this.gameConf.host.paddlePos.y + (+this.hostPaddleDis * (this.canvas?.height || 0))
			})
		},
		AbsPaddleGuest() : {x: number, y: number} {
			return ({
				x : this.gameConf.guest.paddlePos.x, 
				y : this.gameConf.guest.paddlePos.y + (+this.guestPaddleDis * (this.canvas?.height || 0))
			})
		},
		AbsBall() : {x: number, y: number} {
			return ({
				x : this.gameConf.ball.start.x + (this.ballDisX),// * (this.canvas?.width || 0)), 
				y : this.gameConf.ball.start.y + (this.ballDisY)// * (this.canvas?.height || 0))
			})
		},
	},
	methods: {

		canvasSetup() {
			this.canvas_old_width = this.canvas?.width || 0;
			this.canvas_old_height = this.canvas?.height || 0;
			this.canvas = this.$refs.canvas as HTMLCanvasElement;
			this.canvas.width	=  window.innerWidth - window.innerWidth * 50 / 100;
			this.canvas.height	= window.innerHeight - window.innerHeight * 50 / 100;
			this.ccontext = this.canvas?.getContext("2d") as CanvasRenderingContext2D;


			if (this.canvas_old_width)
				this.ballDisX = this.ballDisX * (this.canvas?.width || 0) / this.canvas_old_width;
			if (this.canvas_old_height)
				this.ballDisY = this.ballDisY * (this.canvas?.height || 0) / this.canvas_old_height;
			
			// setting sizes
			this.gameConf.host.paddleWidth	= this.gameConf.guest.paddleWidth	= this.canvas.width * 2 / 100;
			this.gameConf.host.paddleHeight	= this.gameConf.guest.paddleHeight	= this.canvas.height * 20 / 100;
			this.gameConf.ball.radius		= this.canvas.height / 64;
			//pitch
			this.gameConf.pitchLineWidth	= this.gameConf.host.paddleWidth /10;
			this.gameConf.pitchCircleRadius = this.canvas.height / 8;
			this.gameConf.pitchCirclePos	= {x: this.canvas.width / 2, y: this.canvas.height / 2};
			// setting positions
			this.gameConf.host.paddlePos	= {x: 0, y: this.canvas.height / 2 - this.gameConf.host.paddleHeight / 2};
			this.gameConf.guest.paddlePos	= {x: this.canvas.width - this.gameConf.guest.paddleWidth, y: this.canvas.height / 2 - this.gameConf.guest.paddleHeight / 2 }
			this.gameConf.ball.start		= {x: this.canvas.width / 2, y: this.canvas.height / 2 };
			//this.gameConf.pos = {x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height};
		},

		drawOnCanvas() {
			// clearing canvas
			if (null != this.ccontext && null != this.canvas) {
				this.ccontext.fillStyle = "white";
				this.ccontext.fillRect(0, 0, this.canvas.width, this.canvas.height);
				this.ccontext.fillStyle = "black";
				// drawing paddles
				this.ccontext.fillRect(this.AbsPaddleHost.x, this.AbsPaddleHost.y, this.gameConf.host.paddleWidth, this.gameConf.host.paddleHeight);
				this.ccontext.fillRect(this.AbsPaddleGuest.x, this.AbsPaddleGuest.y, this.gameConf.guest.paddleWidth, this.gameConf.guest.paddleHeight);
				// drawing pitch
				this.ccontext.fillRect(
					this.canvas.width / 2 - this.gameConf.pitchLineWidth / 2,
					0,
					this.gameConf.pitchLineWidth,
					this.canvas.height
				);
				this.ccontext.beginPath();
				this.ccontext.arc(
					this.gameConf.pitchCirclePos.x, this.gameConf.pitchCirclePos.y,
					this.gameConf.pitchCircleRadius,
					0, 2 * Math.PI
				);
				this.ccontext.stroke();
				// drawing ball
				this.ccontext.beginPath();
				this.ccontext.arc(this.AbsBall.x, this.AbsBall.y, this.gameConf.ball.radius, 0, 2 * Math.PI);
				this.ccontext.fillStyle = this.gameConf.ball.color;
				this.ccontext.fill();
				this.ccontext.stroke();
			}
		},

		onResize() {
			this.canvasSetup();
			this.drawOnCanvas();
		},

		// keyboard event listeners
		onKeyDown(event: KeyboardEvent) {
			event.preventDefault();
			this.keyState.set(event.key, true);
			if (event.key == ' ')
				this.paused = !this.paused
		},
		onKeyUp(event: KeyboardEvent) {
			event.preventDefault();
			this.keyState.set(event.key, false);
		},

		// TODO
		getDeltaTime() {
			// to resolve with paused state
			const now : number = Date.now();
			this.deltaTime = (now - this.lastTimeStamp);
			// this.clock += this.deltaTime;

			// console.log('now: ' + now)
			// console.log('this.lastTimeStamp: ' + this.lastTimeStamp)
			// console.log('this.deltaTime: ' + this.deltaTime)

			this.lastTimeStamp = now;
		},

		// testing ok, speedFactor could be a bonus, step to be reviewed if we need to change it with this.deltaTime ???
		movePaddle() {
			const speedFactor = 6 
			if (this.keyState.get('ArrowUp') === true) {
				if (this.userIsHost) {
					if (this.AbsPaddleHost.y - speedFactor * this.step >= 0)
						this.hostPaddleDis -= speedFactor * this.step;
				} else {
					if (this.AbsPaddleGuest.y - speedFactor * this.step >= 0)
						this.guestPaddleDis -= speedFactor * this.step;
				}
			}
			if (this.keyState.get('ArrowDown') === true) {
				if (this.userIsHost) {
					if (this.AbsPaddleHost.y + this.gameConf.host.paddleHeight + speedFactor * this.step <= (this.canvas?.height || 0))
						this.hostPaddleDis += speedFactor * this.step;
				} else {
					if (this.AbsPaddleGuest.y + this.gameConf.host.paddleHeight + speedFactor * this.step <= (this.canvas?.height || 0))
						this.guestPaddleDis += speedFactor * this.step;
				}
			}
		},

		// TODO
		moveBall() {

			if (this.gameConf.ball.start.x + (this.ballDisX ) + this.gameConf.ball.radius  >= (this.canvas?.width || 0)
			|| this.gameConf.ball.start.x + (this.ballDisX ) - this.gameConf.ball.radius <= 0)
			{
				this.ballDirX *= -1;//Math.random() * -1;
			}

			if (this.gameConf.ball.start.y + (this.ballDisY)  + this.gameConf.ball.radius  >= (this.canvas?.height || 0)
			|| this.gameConf.ball.start.y + (this.ballDisY) - this.gameConf.ball.radius <= 0)
				this.ballDirY *= -1;//Math.random() * -1;

				
			if (this.ballDirX == 1){
				this.ballDisX += this.step; // this.deltaTime
			}
			else{
				this.ballDisX -= this.step; // this.deltaTime
			}
			if (this.ballDirY == 1)
			{
				this.ballDisY += this.step; // this.deltaTime
			}
			else
			{
				this.ballDisY -= this.step; // this.deltaTime
			}
		},

		// TODO
		countDown() {
			if (this.gameState == 'Start' && this.ccontext){
				for (let i = 3; i > 0; i--){
					this.ccontext.fillStyle = "white";
					this.ccontext.fillRect(0, 0, (this.canvas?.width || 0), (this.canvas?.height || 0));
					this.ccontext.fillStyle = "black";
					this.ccontext.beginPath();
					this.ccontext.fillText(i.toString(), (this.canvas?.width || 0) / 2, (this.canvas?.height || 0) / 2);
					this.ccontext?.stroke();
					console.log(i)
					setTimeout(() => {
					}, 100000);					
				}
				this.clock = true
			}
		},

		gameLoop() {
			if (this.gameState == 'Play'){
				this.getDeltaTime();
				this.movePaddle();
				this.moveBall();
				this.drawOnCanvas();				
			}
			requestAnimationFrame(this.gameLoop);
		},

		closeGame(){
			this.$emit("close");
		}

	},
	mounted() {
		if (debug) console.log('| CanvasGame | mounted()')

		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
		window.addEventListener('resize', this.onResize);

		// fetch opponent // handle error here if opponent is not recognized
		// TODO
		this.opponent.username = 'Opponent name'
		this.opponent.id = 0

		// assign host and guest values
		// TODO
		this.gameConf.host.id = this.user.id			// TODO
		this.gameConf.guest.id = this.opponent.id		// TODO
		
		// initializing variables


		// start game
		this.canvasSetup();
		this.gameLoop();

	},
	beforeUnmount() {
		if (debug) console.log('| CanvasGame | beforeUnmount()')

		window.removeEventListener('keydown', this.onKeyDown);
		window.removeEventListener('keyup', this.onKeyUp);
		window.removeEventListener('resize', this.onResize);
	},
	}
</script>
  


<template>

	
	<v-card
		class="component justify-center align-center"
		style="display: flex; flex-direction: column;" 
	>	
	<v-card-item class="ma-7 justify-center" style="font-weight: bolder; font-size:x-large;" prepend-icon="mdi-cat" append-icon="mdi-cat">CAT PONG</v-card-item>

	
	<v-card class="w-100" flat style="display: flex; flex-direction: row;">
		<v-card flat class="w-50 justify-center text-overline ma-0">
			<v-card-item class=" py-0 justify-center " style="font-weight: bolder; font-size: larger; background-color: lavender;">Host</v-card-item>
			<v-card class=" w-100" flat style="display: flex; flex-direction: row;">
				<v-card-item class=" justify-center w-50">{{ user.username }}</v-card-item>
				<v-card-item class=" justify-center w-50">
					<v-chip class="my-2 text-h6 font-weight-bold" variant="tonal" :color="score.host > score.guest ? 'success' : score.host === score.guest ? 'primary' : 'error'">
					{{ score.host }}</v-chip>
				</v-card-item>				
			</v-card>				
		</v-card>
		<v-card flat class="w-50 justify-center text-overline ma-0">
			<v-card-item class="py-0 justify-center" style="font-weight: bolder; font-size: larger;background-color: lightgoldenrodyellow;">Guest</v-card-item>
			<v-card class="w-100" flat style="display: flex; flex-direction: row;">
				<v-card-item class=" justify-center w-50 ">
					<v-chip class="my-2 text-h6 font-weight-bold" variant="tonal" :color="score.guest > score.host ? 'success' : score.guest === score.host ? 'primary' : 'error'">
					{{ score.guest }}</v-chip>
				</v-card-item>				
				<v-card-item class=" justify-center w-50">{{ opponent.username }}</v-card-item>
			</v-card>				
		</v-card>
	</v-card>

	<canvas id="CanvasGame" ref="canvas" width="800" height="500" style="border:1px solid black;"></canvas>

	<v-overlay
		:model-value="paused"
		class="align-center justify-left"
		persistent
		>
		<v-card class="pa-3 ma-3">
			<v-card-title class="text-center">Game paused</v-card-title>
			<v-card-item>
				<v-btn
					color="primary"
					variant="elevated"
					size="x-large"
					class="mt-10"
					@click="paused = !paused" 
				> Unpause game
				</v-btn>
			</v-card-item>

		</v-card>
	</v-overlay>
	<v-overlay
		:model-value="end"
		class="align-center justify-left"
		persistent
		>
		<v-card class="pa-3 ma-3">
			<v-card-title class="text-center ma-5">{{ userWon ? 'You have won !' : 'You have lost ...' }}</v-card-title>
			<v-card-item>
				<v-btn
					color="primary"
					variant="elevated"
					size="x-large"
					class="ma-5"
					@click="closeGame" 
				> Back to home
				</v-btn>
			</v-card-item>

		</v-card>
	</v-overlay>

	<v-btn
		color="primary"
		variant="elevated"
		size="x-large"
		class="mt-10"
		@click="paused = !paused" 
	>
		{{ paused? 'Unpause game ' : 'Pause game '  }}
	</v-btn>
	<v-card class="ma-5">
		<p>| GAME STATE : {{ gameState }}</p>
		<p>| host : {{ gameConf.host }}</p>
		<p>| guest : {{ gameConf.guest }}</p>
		<p>| ball : {{ gameConf.ball }}</p>
	</v-card>
</v-card>



</template>

<style scoped>
.component {
	max-width:  100%;
	max-height:  100%;
	width: fit-content;
}

</style>
