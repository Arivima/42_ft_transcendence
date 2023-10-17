

<template>
	<v-card class="pa-2 ma-2">
		<v-card-item>
			<v-card-title class="text-overline">Match history</v-card-title>
			<template v-slot:append>
				<!-- <v-btn icon="mdi-plus" size="small"></v-btn> -->
			</template>
		</v-card-item>
  			<v-divider></v-divider>
			<v-table
				fixed-header
				height="300px"
			>
				<thead>
					<tr>
					<th class="text-left">
						Opponent
					</th>
					<th class="text-left">
						{{ data.user.username }}/Opponent
					</th>
					</tr>
				</thead>

				<tbody>
					<tr
					v-for="item in data.games"
					:key="item.username"
					>
					<td>{{ item.username }}</td>
					<td >{{ item.scoreUser }}/{{ item.scoreOpponent }}</td>
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