<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { fetchPlayer, fetchGames } = storeToRefs(playerStore)

export default {
    data () {
        return {
			userProfile: {} as Player,
			stats: {
				loading: false,
				victories: 0,
				losses: 0,
				ladder: 0
			},
        }
    },
    methods: {
		getUserProfile() {
			let Profileid : number = Number(this.$route.params.id)
			Profileid = 81841 // TODO change when route update
			fetchPlayer.value(Profileid)
				.then((targetUser : Player) => {
					this.userProfile = targetUser;
					this.setStats()
				})
				.catch((err) => console.log(err))
		},
		async setStats() {
			this.stats.loading = true
			// TODO : ADD IN DATABASE
			try {
				const games = await fetchGames.value(this.userProfile.id)
				for (const game of games) {
					if (game.host == this.userProfile.username) {
						if (game.host_score > game.guest_score) this.stats.victories++
						else this.stats.losses++
						this.stats.ladder += game.host_score - game.guest_score
					} else {
						if (game.host_score > game.guest_score) this.stats.losses++
						else this.stats.victories++
						this.stats.ladder += game.guest_score - game.host_score
					}
				}
				this.stats.loading = false
			} catch (err) {
				console.error(err)
				this.stats.loading = false
			}
		}
	},
    mounted (){
		this.getUserProfile()
    },
}
</script>

<template>
	<v-card
		class="itemStats backgroundItem"
		density="compact"
		variant="flat"
		:loading="stats.loading"
	>
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
</template>

<style>

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

.backgroundItem {
	background-color: rgba(255, 255, 255, 0.497);
	color: black;
	border-radius: 30px; /*Increase or decrease the value for controlling the roundness*/
	width: fit-content;
	outline: solid;
	outline-color: antiquewhite;
}

</style>