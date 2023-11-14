<template>
	<v-dialog v-model="groupChatDialog" max-width="500">
	  <v-card>	
		<v-card-title>Enter Group Chat Name</v-card-title>
		<v-card-text>
		  <v-text-field v-model="group.name" label="Group Chat Name"></v-text-field>
		</v-card-text>
		<v-card-title>Select Friends for Group Chat</v-card-title>
			<v-select
				v-model="group.members"
				:items="friends"
				item-title="name"
				item-value="id"
				label="Select Item"
				multiple
			>
				<template v-slot:selection="{ item, index }">
				<v-chip v-if="index < 2">
					<span>{{ item.title }}</span>
				</v-chip>
				<span
					v-if="index === 2"
					class="text-grey text-caption align-self-center"
				>
					(+{{ value.length - 2 }} others)
				</span>
				</template>
			</v-select>
			<v-card-actions>
		  <v-btn @click="createGroupChatWithSelectedFriends">Create Group Chat</v-btn>
		  <v-btn @click="closeGroupChatPopup">Cancel</v-btn>
		</v-card-actions>
	  </v-card>
	</v-dialog>
  </template>
  
  <script>
  export default {
	data() {
		
	  return {
		groupChatDialog: false,
		friendSearch: '',
		friends: [], // Populate this with your list of friends from the backend
		socket: null,
		group: {
			name: '',
			founderId: 0,
			members: [],
			isPublic: false,
			password: ''
		},
	  };
	},
	computed: {
	  filteredFriends() {
		return this.friends
	  },
	},
	methods: {
	  closeGroupChatPopup() {
		this.group.members = [];
		this.groupChatDialog = false;
		this.group.name = '';

	  },
	  createGroupChatWithSelectedFriends() {
		try {
				this.group.members.push(this.group.founderId);
				this.socket.emit("creategroupchat", { group: this.group }, (response) => {
					console.log("response", response);
				});
			} catch (error) {
				console.error("Error emitting 'getmessagesprivatechat':", error);
		}
		this.closeGroupChatPopup();
	  },
	},
  };
  </script>
  