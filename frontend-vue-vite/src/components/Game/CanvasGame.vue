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




import { defineComponent } from 'vue'
import { usePlayerStore, type Player, FrameDto, CustomizationOptions } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user, currentGame } = storeToRefs(playerStore)

const debug = false

export class TimeState {
	public start: number;	// start of game abs nb performance.now(), gets fired with startGame()
	public pause: number; // cumulates all off time incl pause, lag, wait
	public clock: number; // cumulates actual running time of game
	public lastTimeStamp: number; // last update
	public deltaTime: number; // last time gap between screen updates

	constructor(){
		this.start = performance.now();
		this.pause = 0;
		this.clock = 0;
		this.deltaTime = 0;
		this.lastTimeStamp = 0;
	}
	getDeltaTime() {
		const now : number = performance.now();
		this.deltaTime = now - this.lastTimeStamp
		this.lastTimeStamp = now
	}
	getSeconds(milliseconds: number) : number {   // function to calculate seconds from milliseconds
		return Math.floor((milliseconds / 1000) % 60)
	}
	getMinutes(milliseconds: number) : number{   // function to calculate minutes from milliseconds
		return Math.floor((milliseconds / 1000) / 60)
	}
}


// TODO

// implement and test, in this order

	// send loop
	// receive loop

	// screen resize
		//! check if we need to limit min and max canvas size

	// move paddle

	// move ball
	// step
	// time
	// smooth animation
		//! pb when screen resize, different speed ballSpeedFactor

	// check extreme values (start on edge, get stuck etc)

	// bounce off paddle

	// handle if !canvas
	// test score

// Should include
	// responsivity
	// customization, maps (collision Y can change ball color)
	// power-ups
	// streaming
	// network issues, like unexpected disconnection or lag
		// pause
		// automatic reconnection
		// catch-up to match
		// anything else but the game should not crash
	// browser compatibility
	// wins and losses, ladder level, achievement
	// NO CRASH


 // Check if needed for browser compatibility
//  const requestAnimationFrame =
//   window.requestAnimationFrame ||
//   window.mozRequestAnimationFrame ||
//   window.webkitRequestAnimationFrame ||
//   window.msRequestAnimationFrame;
// const cancelAnimationFrame =
//   window.cancelAnimationFrame || window.mozCancelAnimationFrame;

export default defineComponent({
	data: () => ({
			ready : false, /*clean start when component is mounted and gameStatus == playing*/

			gameTime : {} as TimeState,
			paused: false,

			keyState: new Map<string, Boolean>([
				['ArrowUp', false], ['ArrowDown', false], [' ', false]
			]),

			/* values to be shared */
			frame : new FrameDto(),

			/* local values */
			canvas : null as HTMLCanvasElement | null,
			ccontext: null as CanvasRenderingContext2D | null,

			ballSpeedFactor : 500/1000, // px/sec (1000 milliseconds)
	}),
	computed : {
		isReadyAndPlaying() : boolean {
			if (debug) console.log('| CanvasGame | computed | isReadyAndPlaying : ' + this.gameStatus === "playing" && this.ready === true)
			return this.gameStatus === "playing" && this.ready === true
		},

		host() : Player {
			if (debug) console.log('| CanvasGame | computed | host()')
			return currentGame.value.host
		},
		guest() : Player {
			if (debug) console.log('| CanvasGame | computed | guest()')
			return currentGame.value.guest
		},
		customizations() : CustomizationOptions {
			if (debug) console.log('| CanvasGame | computed | customizations()')
			return currentGame.value.customizations
		},
		newFrame() : FrameDto {
			if (debug) console.log('| CanvasGame | computed | newFrame ' + currentGame.value.frame.seq)
			this.frame = currentGame.value.frame
			if (this.isReadyAndPlaying)
				this.frame.seq++
			this.drawOnCanvas();
			return currentGame.value.frame
		},

		gameStatus() : 'undefined' | 'building' | 'playing' | 'end' {
			if (debug) console.log(`%c| CanvasGame | computed | gameStatus : ${currentGame.value.status}`, 'background: green; color: white')
			return currentGame.value.status
		},
		streaming() : boolean {
			if (debug) console.log('| CanvasGame | computed | streaming')
			return (currentGame.value.status == 'playing' && currentGame.value.gameInfo.watcher == true)
		},
		endReason() : 'undefined' | 'hostWin' | 'guestWin' | 'userLeft' | 'aPlayerLeft' | 'opponentLeft' {
			if (debug) console.log('| CanvasGame | computed | endReason : ' + currentGame.value.endReason)
			return currentGame.value.endReason
		},
		gameInfo() : {hostID: number, guestID: number, watcher: boolean} {
			if (debug) console.log('| CanvasGame | computed | gameInfo()')
			return currentGame.value.gameInfo
		},
		userIsHost() : boolean {
			return (this.host.id == user.value.id)
		},
		userIsGuest() : boolean {
			return (this.guest.id == user.value.id)
		},

		AbsBallRadius() : number {
			return (this.newFrame.data.ball.radius * 
					((this.canvas?.height || 0) < (this.canvas?.width || 0) ? (this.canvas?.height || 0) : (this.canvas?.width || 0)))
		},
	},
	watch : {
		gameStatus(newVal : 'undefined' | 'building' | 'playing' | 'end'){
			if (debug) console.log('| CanvasGame | watchers | gameStatus : ' + newVal)
			if (newVal == 'undefined')
				this.onLeaving()
		},
		isReadyAndPlaying(newVal : boolean){
			if (debug) console.log('| CanvasGame | watchers | isReadyAndPlaying : ' + newVal)
			if (newVal == true)
				this.onStartGame()
		},
		// newFrame: {
		// 	handler(newVal : FrameDto, oldVal : FrameDto) {
		// 		if (debug) console.log(`| CanvasGame | watchers | newFrame ? ${newVal == oldVal}`)
		// 		this.onNewFrame()
		// 	},
		// 	deep: true,
		// },

	},
	methods: {
		onStartGame() {
			/* initialize colors */
			this.frame.hostID = this.host.id
			this.frame.guestID = this.guest.id
			this.frame.data.host.paddle.color = this.customizations.paddle_color
			this.frame.data.guest.paddle.color = this.customizations.paddle_color
			this.frame.data.ball.color = this.customizations.ball_color
			/*launch clock*/
			this.gameTime = new TimeState()
			this.gameTime.getDeltaTime()
			/*send first frame*/
			this.sendFrame();
			/*start loop*/
			this.gameLoop();
		},

		onResize() {
			if (debug) console.log('| CanvasGame | methods | onResize()')
			this.canvasSetup();
			this.drawOnCanvas();
		},

		// onNewFrame() {
		// 	if (debug) console.log('| CanvasGame | methods | onNewFrame()')
		// 	this.updateFrame()
		// 	this.drawOnCanvas();
		// },
		// updateFrame(){
		// 	if (debug) console.log('| CanvasGame | methods | updateFrame()')
		// 	this.frame = this.newFrame
		// 	this.frame.seq++
		// },
		
		sendFrame(){
			if (debug) console.log('| CanvasGame | methods | sendFrame()')
			playerStore.sendFrame(this.frame)
		},

		gameLoop() {
			// if (debug) console.log('| CanvasGame | methods | gameLoop()')
					
				if (this.gameStatus == 'playing'){
					this.gameTime.getDeltaTime()
					this.movePaddle();
					this.moveBall();
					this.sendFrame();
				}
				requestAnimationFrame(this.gameLoop);				
		},

		exitGame(){
			if (debug) console.log('| CanvasGame | methods | exitGame()')
			playerStore.exitGame()
		},
		onLeaving(){
			if (debug) console.log('| CanvasGame | methods | onLeaving()')
			if (currentGame.value.endReason == 'undefined' && currentGame.value.host.id)
				this.exitGame()
			playerStore.resetGame()
		},

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

		colorScore(player : 'host' | 'guest') : string {
			const hostScore = this.newFrame.data.host.score
			const guestScore = this.newFrame.data.guest.score
			if (player == 'host')
				return hostScore > guestScore ? 'success' : guestScore === hostScore ? 'primary' : 'error'
			else  
				return guestScore > hostScore ? 'success' : guestScore === hostScore ? 'primary' : 'error'
		},

		// Absolute position on the canvas | value : number between 0-1
		AbsPosCanvasX(value : number) : number {
			return value * (this.canvas?.width || 0)
		},
		AbsPosCanvasY(value : number) : number {
			return value * (this.canvas?.height || 0)
		},

		canvasSetup() {
			if (debug) console.log('| CanvasGame | methods | canvasSetup()')
			this.canvas = this.$refs.canvas as HTMLCanvasElement;
			this.ccontext = this.canvas?.getContext("2d") as CanvasRenderingContext2D;
			if (!this.canvas || !this.ccontext ){
				if (debug && !this.canvas) console.log('| CanvasGame | methods | canvasSetup() | EMPTY CANVAS ')
				if (debug && !this.ccontext) console.log('| CanvasGame | methods | canvasSetup() | EMPTY CONTEXT ')
				return;
			} 
			// reactive canvas size with 16:9 view ratio
			this.canvas.width	=  window.innerWidth - window.innerWidth * 50 / 100;
			this.canvas.height	= 	(this.canvas.width / 16 * 9) > (window.innerHeight - window.innerHeight * 50 / 100) ?
									(window.innerHeight - window.innerHeight * 50 / 100) 
									: (this.canvas.width / 16 * 9);

			// set flag to ready
			this.ready = true
		},

		drawOnCanvas() {
			if (debug) console.log('| CanvasGame | methods | drawOnCanvas()')
			if (null != this.ccontext && null != this.canvas) {
				/*clearing canvas*/
				this.ccontext.fillStyle = "white";
				this.ccontext.fillRect(0, 0, this.canvas.width , this.canvas.height);
				/*Pitch background*/
				this.ccontext.fillStyle = this.customizations.pitch_color;
				this.ccontext.fillRect(0, 0, this.canvas.width , this.canvas.height); 
				/*Pitch line*/
				this.ccontext.fillStyle = "black";
				this.ccontext.beginPath();	
				this.ccontext.moveTo(this.canvas.width / 2, 0)
				this.ccontext.lineTo(this.canvas.width / 2, this.canvas.height)
				this.ccontext.stroke();
				/*Pitch circle*/
				this.ccontext.fillStyle = "black";
				this.ccontext.beginPath(); 
				this.ccontext.arc(
					this.canvas.width / 2, this.canvas.height / 2, /*x, y*/
					this.canvas.height / 8, /*radius*/
					0, 2 * Math.PI /*angle*/
				);
				this.ccontext.stroke();
				/*paddles*/
				this.ccontext.fillStyle = this.newFrame.data.host.paddle.color;
				this.ccontext.fillRect(	this.AbsPosCanvasX(this.newFrame.data.host.paddle.x),
										this.AbsPosCanvasY(this.newFrame.data.host.paddle.y), 
										this.AbsPosCanvasX(this.newFrame.data.host.paddle.w),
										this.AbsPosCanvasY(this.newFrame.data.host.paddle.h));
				this.ccontext.fillStyle = this.newFrame.data.guest.paddle.color;
				this.ccontext.fillRect(	this.AbsPosCanvasX(this.newFrame.data.guest.paddle.x),
										this.AbsPosCanvasY(this.newFrame.data.guest.paddle.y), 
										this.AbsPosCanvasX(this.newFrame.data.guest.paddle.w),
										this.AbsPosCanvasY(this.newFrame.data.guest.paddle.h));
				/*ball*/
				this.ccontext.fillStyle = this.newFrame.data.ball.color;
				this.ccontext.beginPath();
				this.ccontext.arc(	this.AbsPosCanvasX(this.newFrame.data.ball.x), 
									this.AbsPosCanvasY(this.newFrame.data.ball.y), 
									this.AbsBallRadius, 
									0, 2 * Math.PI);
				this.ccontext.fill();
				this.ccontext.stroke();
			}
		},

		movePaddle() {
			// if (debug) console.log('| CanvasGame | methods | movePaddle()')
			// const step : number = this.gameTime.deltaTime * this.ballSpeedFactor
			const step =  10 / (this.canvas?.height || 0) /* 1 pixel per step */


			if (this.keyState.get('ArrowUp') === true) {
				if (this.userIsHost) {
					if (this.frame.data.host.paddle.y - step > 0)
						this.frame.data.host.paddle.y -= step;
				} else {
					if (this.frame.data.guest.paddle.y - step > 0)
						this.frame.data.guest.paddle.y -= step;
				}
				if (debug)console.log('ArrowUp')
				if (debug)console.log('paddle step : ' + step)
				if (debug)console.log('host.paddle.y : ' + this.frame.data.host.paddle.y)

			}
			if (this.keyState.get('ArrowDown') === true) {
				if (this.userIsHost) {
					if (this.frame.data.host.paddle.y + this.frame.data.host.paddle.h + step < 1)
						this.frame.data.host.paddle.y += step;
				} else {
					if (this.frame.data.guest.paddle.y + this.frame.data.guest.paddle.h + step < 1)
						this.frame.data.guest.paddle.y += step;
				}
				if (debug)console.log('ArrowDown')
				if (debug)console.log('paddle step : ' + step)
				if (debug)console.log('host.paddle.y + host.paddle.h : ' + this.frame.data.guest.paddle.y + this.frame.data.guest.paddle.h)
			}
		},

		collisionX(direction : number){
			if (debug) console.log(`| CanvasGame | methods | collisionX() 
				guest ${this.frame.data.guest.score} 
				host ${this.frame.data.host.score} `)
			return direction == 1 ? this.frame.data.guest.score++ : this.frame.data.host.score++			
		},
		collisionY(direction : number){
			return direction == 1 ? this.frame.data.ball.color = '#0000FF' : this.frame.data.ball.color = this.customizations.ball_color	
		},

		moveBall() {
			const step =  1 / 150 /* 0.5 seconds from x = 0 to x = width */
			// const step : number = this.gameTime.deltaTime * this.ballSpeedFactor

			// collision of X axis
			/* check collision paddle guest */
			if ((this.frame.data.ball.x + this.frame.data.ball.radius + this.frame.data.guest.paddle.w > 1)
				&& ((this.frame.data.ball.y < (this.frame.data.guest.paddle.y + this.frame.data.guest.paddle.h))
					&& (this.frame.data.ball.y > this.frame.data.guest.paddle.y))){
					this.frame.data.ball.dx *= -1;
			}
			/* check collision paddle host */
			else if ((this.frame.data.ball.x - this.frame.data.ball.radius - this.frame.data.host.paddle.w < 0)
				&& ((this.frame.data.ball.y < (this.frame.data.host.paddle.y + this.frame.data.host.paddle.h))
					&& (this.frame.data.ball.y > this.frame.data.host.paddle.y))){
					this.frame.data.ball.dx *= -1;
			}
			/* check collision wall */
			else if (this.frame.data.ball.x + this.frame.data.ball.radius > 1 || this.frame.data.ball.x - this.frame.data.ball.radius < 0) {
					this.frame.data.ball.dx *= -1;
				this.collisionX(this.frame.data.ball.dx)
			}

			// collision of Y axis
			if (this.frame.data.ball.y + this.frame.data.ball.radius > 1 || this.frame.data.ball.y - this.frame.data.ball.radius < 0){
				this.frame.data.ball.dy *= -1;
				this.collisionY(this.frame.data.ball.dy)
			}

			/*update position of ball*/
			if (this.frame.data.ball.dx == 1){
				this.frame.data.ball.x += step;
			} else {
				this.frame.data.ball.x -= step;
			}

			if (this.frame.data.ball.dy == 1) {
				this.frame.data.ball.y += step;
			} else {
				this.frame.data.ball.y -= step;
			}
		},
	},

	// LIFECYCLE HOOKS
	beforeCreate() {
		if (debug) console.log('| CanvasGame | beforeCreate()')
	},
	created() {
		if (debug) console.log('| CanvasGame | created')
	},
	beforeMount() {
		if (debug) console.log('| CanvasGame | beforeMount')
	},	
	mounted() {
		if (debug) console.log('| CanvasGame | mounted()')

		window.addEventListener('beforeunload', this.onLeaving);
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
		window.addEventListener('resize', this.onResize);

		/*set-up canvas*/
		this.canvasSetup();

	},
	beforeUpdate() {
		if (debug) console.log('| CanvasGame | beforeUpdate')
	},
	updated() {
		if (debug) console.log('| CanvasGame | updated')
	},
	beforeUnmount() {
		if (debug) console.log('| CanvasGame | beforeUnmount()')
		this.onLeaving()
		window.removeEventListener('beforeunload', this.onLeaving);
		window.removeEventListener('keydown', this.onKeyDown);
		window.removeEventListener('keyup', this.onKeyUp);
		window.removeEventListener('resize', this.onResize);
	},
	beforeRouteLeave() {
		if (debug) console.log('| CanvasGame | beforeRouteLeave()')
		this.onLeaving()
	},
	unmounted() {
		if (debug) console.log('| CanvasGame | unmounted()')
	},
})
</script>
  


<template>
	<v-card
		class="component justify-center align-center"
		style="display: flex; flex-direction: column;" 
	>
		<v-card class="w-100" flat style="display: flex; flex-direction: row;">
			<v-card flat class="w-50 justify-center text-overline ma-0">
				<v-card-item class="py-0 justify-center " style="font-weight: bolder; font-size: larger; background-color: lavender;">
					Host
				</v-card-item>
				<v-card class="w-100" flat style="display: flex; flex-direction: row;">
					<v-card-item class="justify-center" style="flex-grow: 2;" :prepend-avatar="host.avatar">
						{{ host.username }}
					</v-card-item>
					<v-card-item class="justify-center">
						<v-chip
							class="my-2 text-h6 font-weight-bold" variant="tonal"
							:color="colorScore('host')"
						>
						{{ newFrame.data.host.score }}</v-chip>
					</v-card-item>				
				</v-card>				
			</v-card>
			<v-card flat class="w-50 justify-center text-overline ma-0">
				<v-card-item class="py-0 justify-center" style="font-weight: bolder; font-size: larger;background-color: lightgoldenrodyellow;">
					Guest
				</v-card-item>
				<v-card class="w-100" flat style="display: flex; flex-direction: row;">
					<v-card-item class="justify-center">
						<v-chip
						:color="colorScore('guest')"
						class="my-2 text-h6 font-weight-bold" variant="tonal" 
					>
						{{ newFrame.data.guest.score }}</v-chip>
					</v-card-item>				
					<v-card-item class=" justify-center" style="flex-grow: 2;" :append-avatar="guest.avatar">
						{{ guest.username }}
					</v-card-item>
				</v-card>				
			</v-card>
		</v-card>

		<canvas id="CanvasGame" ref="canvas" :width="16*100/2" :height="9*100/2" style="border:1px solid black;"></canvas>

		<v-card
			style="display: flex; flex-direction: row;"
			class="w-100 -5 justify-center"
			flat
		>

			<v-btn
				color="primary"
				variant="tonal"
				size="x-large"
				class="ma-2"
				@click="exitGame" 
			> Exit Game
			</v-btn>
		</v-card>

		<v-card :width="canvas?.width" style="display: flex; flex-direction: row;" class="ma-0 pa-0" flat>
			<v-card class="pa-1 ma-1 w-50">
				<h2>BALL</h2>
				<p>| {{ Math.round(newFrame.data.ball.x) }}, {{ Math.round(newFrame.data.ball.y) }}</p>
				<p>| x {{Math.round(newFrame.data.ball.x)}} y {{ Math.round(newFrame.data.ball.y) }}</p>
				<p>| dx {{newFrame.data.ball.dx}} dy {{ newFrame.data.ball.dy }} </p>
				<p>| radius {{ Math.round(newFrame.data.ball.radius) }}</p>
				<p>| color {{ newFrame.data.ball.color }}</p>
				
				<h2>PADDLE</h2>
				<p>	| host..
					| w{{ Math.round(newFrame.data.host.paddle.w) }} h{{ Math.round(newFrame.data.host.paddle.h) }}
					| {{ Math.round(newFrame.data.host.paddle.x) }}, {{ Math.round(newFrame.data.host.paddle.y) }} 
					| y {{ Math.round(newFrame.data.host.paddle.y) }}</p>
				<p>	| guest
					| w{{ Math.round(newFrame.data.guest.paddle.w) }} h{{ Math.round(newFrame.data.guest.paddle.h) }}
					| {{ Math.round(newFrame.data.guest.paddle.x) }}, {{ Math.round(newFrame.data.guest.paddle.y) }} 
					| y {{ Math.round(newFrame.data.guest.paddle.y) }}</p>


			</v-card>		
			<v-card class="pa-1 ma-1 w-50">
				<h2>CONF</h2>
				<p>| host {{ host.id }} | guest {{ guest.id }}</p>
				<p>| canvas | w{{ canvas?.width }} h{{ canvas?.height }}</p>
				<p>| deltaTime |  {{ Math.round(gameTime.deltaTime) }} | </p>
				<p>| lastTimeStamp |  {{ Math.round(gameTime.lastTimeStamp) }} | </p>
			</v-card>
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
