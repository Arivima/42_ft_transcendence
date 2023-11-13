<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

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


const playerStore = usePlayerStore()
const { user } = storeToRefs(playerStore)

const debug = false

export interface PlayerConf {
	paddleHeight: number,
	paddlePos: {x: number, y: number}
}

export interface GameConf {
	hostConf: PlayerConf,
	guestConf: PlayerConf,
	ballPos: {x: number, y: number}
	paddleWidth: number,
	ballRadius: number,
	pitchLineWidth: number,
	pitchCirclePos: {x: number, y: number},
	pitchCircleRadius: Number,
	// ballColor: string,
	// paddleColor: string,
	// pitchColor: string,
}

const emptyConf = {
	hostConf: {
		paddleHeight: 0,
		paddlePos: {x: 0, y: 0},
	},
	guestConf: {
		paddleHeight: 0,
		paddlePos: {x: 0, y: 0},
	},
	ballPos: {x: 0, y: 0},
	paddleWidth: 0,
	ballRadius: 0,
	pitchLineWidth: 0,
	pitchCirclePos: {x: 0, y: 0},
	pitchCircleRadius: 0
}

export default {
	components:	{
},
	data: () => ({
			canvas: null,
			ccontext: null,
			gameConf: emptyConf,
	}),
	computed : {
	},
	watch : {
	},
	beforeCreate() {
	if (debug) console.log('| BlockedSent | beforeCreate()')
	},
	created() {
		if (debug) console.log('| BlockedSent | created()')
	},
	beforeMount() {
		if (debug) console.log('| BlockedSent | beforeMount()')
	},
	mounted() {
		if (debug) console.log('| BlockedSent | mounted()')

		this.canvas = this.$refs.canvas;
		this.canvas.width =  window.innerWidth - window.innerWidth * 50 / 100;
		this.canvas.height = window.innerHeight - window.innerHeight * 50 / 100;
		
		this.ccontext = this.canvas.getContext("2d");

		// setting sizes
		this.gameConf.paddleWidth = this.canvas.width * 2 / 100;
		this.gameConf.hostConf.paddleHeight = this.canvas.height * 20 / 100;
		this.gameConf.guestConf.paddleHeight = this.canvas.height * 20 / 100;
		this.gameConf.ballRadius = this.canvas.height / 64;
		//pitch
		this.gameConf.pitchLineWidth = this.gameConf.paddleWidth;
		this.gameConf.pitchCircleRadius = this.canvas.height / 8;
		this.gameConf.pitchCirclePos = {x: this.canvas.width / 2, y: this.canvas.height / 2};

		// setting positions
		this.gameConf.hostConf.paddlePos = {x: 0, y: this.canvas.height / 2 - this.gameConf.hostConf.paddleHeight / 2};
		this.gameConf.guestConf.paddlePos = {x: this.canvas.width - this.gameConf.paddleWidth, y: this.canvas.height / 2 - this.gameConf.guestConf.paddleHeight / 2 }
		this.gameConf.ballPos = {x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height};

		// drawing paddles
		this.ccontext.fillRect(this.gameConf.hostConf.paddlePos.x, this.gameConf.hostConf.paddlePos.y, this.gameConf.paddleWidth, this.gameConf.hostConf.paddleHeight);
		this.ccontext.fillRect(this.gameConf.guestConf.paddlePos.x, this.gameConf.guestConf.paddlePos.y, this.gameConf.paddleWidth, this.gameConf.guestConf.paddleHeight);

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
		this.ccontext.arc(this.gameConf.ballPos.x, this.gameConf.ballPos.y, this.gameConf.ballRadius, 0, 2 * Math.PI);
		this.ccontext.fillStyle = "black";
		this.ccontext.fill();
		this.ccontext.stroke();

		window.addEventListener("keydown", () => {
			console.log(`keydown`);
			this.gameConf.hostConf.paddleHeight += 10;
		})

	},
	beforeUpdate() {
		if (debug) console.log('| BlockedSent | beforeUpdate()')
	},
	updated() {
		if (debug) console.log('| BlockedSent | updated()')
	},
	beforeUnmount() {
		if (debug) console.log('| BlockedSent | beforeUnmount()')
	},
	unmounted() {
		if (debug) console.log('| BlockedSent | unmounted()')
	},
	}
</script>
  


<template>
	<v-card
		class="component justify-center align-center "
		min-width="500"
		title="Game canvas"
	>	

    <canvas id="CanvasGame" ref="canvas" width="800" height="500" style="border:1px solid purple;">
    </canvas>

	</v-card>
</template>

<style scoped>
.component {
	max-width:  100%;
	max-height:  100%;
	width: fit-content;
}

</style>