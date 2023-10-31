<script lang="ts">
import { defineComponent } from 'vue'
import { usePlayerStore, type FriendRequest } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'
// import axios from 'axios'

const playerStore = usePlayerStore()
const { user, notifications } = storeToRefs(playerStore)

export default defineComponent({
	components: {
	},
	data() {
		return {
            user: user,
			count: 0,
			notificationList: notifications
		}
	},
	methods: {
		setNotificationsCount(){
			this.count = this.notificationList.length;
		},
		acceptFriend(request : FriendRequest){
			request.status = 'loading'
			setTimeout(() => {
				// axios.post(friendship/accept)
				//(this delete the entry from the request list)
				// if ok
				request.status = 'accepted'
			}, 5000);
			this.deleteRequest(request)
		},
		rejectFriend(request : FriendRequest){
			request.status = 'loading'
			setTimeout(() => {
				request.status = 'rejected'
			}, 5000);
			this.deleteRequest(request)
		},
		deleteRequest(request : FriendRequest){
			setTimeout(() => {
				const id = this.notificationList.findIndex((el: any) => el == request);
				// const id = this.notificationList.findIndex(el => el === request);
				this.notificationList.splice(id, 1);
				// this.notificationList.splice(id, 1);	
				this.setNotificationsCount()
			}, 20000);
		},
	},
	watch: {
    },

	beforeCreate() {
		console.log('| Notifications | beforeCreate()')
	},
	created() {
		console.log('| Notifications | created()')
	},
	beforeMount() {
		console.log('| Notifications | beforeMount()')
	},
	mounted() {
		console.log('| Notifications | mounted()')
		// this.notificationList = this.notificationList
		this.notificationList = notifications;
		this.setNotificationsCount()
    },
	beforeUpdate() {
		console.log('| Notifications | beforeUpdate()')
	},
	updated() {
		console.log('| Notifications | updated()')
	},
	beforeUnmount() {
		console.log('| Notifications | beforeUnmount()')
	},
	unmounted() {
		console.log('| Notifications | unmounted()')
	},
})
</script>

<template>
<v-card	class="d-flex pa-3 justify-end align-start" color="transparent" flat>
	<v-menu max-height="150" :close-on-content-click=Boolean(false)>
		<template v-slot:activator="{ props }">
			<v-badge
				:content=count
				color="error"
			>
				<v-btn
					v-bind="props"
					icon="mdi-bell"
					class="ma-0 pa-0 justify-center align-center"
				>
				</v-btn>				
			</v-badge>
		</template>
		<v-list
		>
			<v-list-item-subtitle class="px-2 text-overline">Friend requests</v-list-item-subtitle>
			<v-list-item
				v-show="notificationList.length == 0"
			>No new friend request</v-list-item>
			<v-list-item
				v-for="(item, index) in notificationList"
				:key="index"
				:value="index"
				:title="item.requestorUsername"
				:prepend-avatar="item.requestorAvatar"
				density="compact"
				class="px-2"
			>
				<template v-slot:prepend>
					<v-avatar size="small"> </v-avatar>
				</template>			
				<template v-slot:append>
					<v-sheet class="pa-0 ml-2  ">
						<v-icon
							v-show="item.status == 'pending'"
							@click="acceptFriend(item)"
							icon="$success"
							color="success"
						>
						</v-icon>
						<v-icon
							v-show="item.status == 'pending'"
							@click="rejectFriend(item)"
							icon="$error"
							color="error"
							class="ml-1"
						> </v-icon>
						<v-progress-circular
							v-show="item.status == 'loading'"
							indeterminate
							rounded
							size="x-small"
							width="2"
							color="primary"
						>
						</v-progress-circular>
						<v-chip
							v-show="item.status == 'accepted'"
							size="x-small"
							color="success"
							text="accepted"
							variant="tonal"
						> </v-chip>
						<v-chip
							v-show="item.status == 'rejected'"
							size="x-small"
							color="info"
							text="rejected"
							variant="tonal"
						> </v-chip>
					</v-sheet>
				</template>
			</v-list-item>
		</v-list>
	</v-menu>
</v-card>
</template>

<style scoped>

</style>