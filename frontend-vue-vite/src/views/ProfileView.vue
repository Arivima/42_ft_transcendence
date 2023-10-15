<!-- PROFILE -->

<!-- TODO
- link with database on all modules
- responsiveness on screen size
- position of cards on the page
-->

<script setup lang="ts">
import NavSideBar from '../components/NavSideBar.vue'
import UserCard from '../components/Profile/UserCard.vue'
import MatchHistoryTable from '../components/Profile/MatchHistoryTable.vue'
import MatchHistoryServer from '../components/WIP/MatchHistoryServer.vue'
import Friends from '../components/Profile/Friends.vue'
import Achievements from '../components/Profile/Achievements.vue'
import SearchBar from '../components/Utils/SearchBar.vue'
</script>

<template>
    <div class="profile">
        <NavSideBar/>
		<v-card
				class="d-flex  flex-column layer-0"
				tile
				variant="outlined"
				min-height="800px"
				min-width="500"
			>
				<v-card
					class="d-flex  flex-column layer-1"
					tile
					variant="outlined"
				>
					<UserCard/>
				</v-card>

				<v-spacer></v-spacer>

				<v-card
					class="d-flex  flex-column  layer-1"
					tile
					variant="outlined"
				>

					<v-card
						class="d-flex flex-row layer-2"
						tile
						variant="outlined"
					>
						<v-card
							class="d-flex  flex-column"
							tile
							variant="outlined"
						>
							<Achievements/>
							<MatchHistoryTable/>                
							<!-- <MatchHistoryServer/>                 -->
						</v-card>

						<v-card
							class="d-flex "
							tile
							variant="outlined"
						>
						<!-- <SearchBar/> -->
						<Friends/>
						</v-card>
				</v-card>

				</v-card>
		</v-card>

    </div >
</template>
