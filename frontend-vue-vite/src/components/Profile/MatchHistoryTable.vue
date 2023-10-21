<style scoped>
.component .v-table {
	background-color: transparent;
}

/* table title row */
.v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th  {
	background-color: transparent;
}
</style>

<template>
	<v-card class="component">
		<v-card-item>
			<v-card-title class="text-overline">Match history</v-card-title>
		</v-card-item>
		<v-divider></v-divider>
		<v-table
			fixed-header
			height="300px"
		>
			<thead>
				<tr>
				<th class="text-left text-button">

				</th>
				<th class="text-center text-overline">
					Opponent
				</th>
				<th class="text-center text-overline">
					{{ data.user.username }}
				</th>
				</tr>
			</thead>

			<tbody>
				<tr
				v-for="item in data.games"
				:key="item.username"
				>
				<td class="text-left">{{ item.username }}</td>
				<td class="text-center">{{ item.scoreOpponent }}</td>
				<td class="text-center">{{ item.scoreUser }}</td>
				</tr>
			</tbody>
		</v-table>
	</v-card>
</template>



<script setup lang="ts">
import { ref, reactive } from 'vue';

const data = reactive({
		games : [
          {
            username: 'Pauline',
            scoreUser: 2,
            scoreOpponent: 3,
          },
          {
            username: 'Sarah',
            scoreUser: 4,
            scoreOpponent: 3,
          },
          {
            username: 'Caroline',
            scoreUser: 1,
            scoreOpponent: 1,
          },
          {
            username: 'Daphné',
            scoreUser: 1,
            scoreOpponent: 4,
          },
        ],
		user : {
			username: 'Arielle',

		}});
</script>