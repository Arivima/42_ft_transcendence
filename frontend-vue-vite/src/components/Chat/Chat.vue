<template>
	<div id="chat">
		<v-app>
			<v-container class="fill-height pa-0">
				<v-row class="no-gutters elevation-4">
					<v-col cols="12" sm="3" class="flex-grow-1 flex-shrink-0" style="border-right: 1px solid #0000001f;">
						<v-responsive class="overflow-y-auto fill-height" height="500">
							<v-list subheader>
								<v-btn @click="openGroupCreationPopup">Create Group Chat</v-btn>
								<div class="">
									
								<v-item-group v-model="activeChat">
									<template v-for="(item, index) in parents" :key="`parent${index}`">
										<v-list-item :value="item.id" @click="activateChat(item.id, index, item.isGroup)" class="pa-4 pointer elevation-1 mb-2"
										>
											<v-avatar color="grey lighten-1 white--text">
												<v-icon>chat_bubble</v-icon>
											</v-avatar>
											<v-list-item-title v-text="item.name" />
											<v-list-item-subtitle v-text="item.lastMessage" />
											<!-- <v-list-item-icon> -->
												<!-- <v-icon
													:color="item.active ? 'deep-purple accent-4' : 'grey'">chat_bubble</v-icon> -->
											<!-- </v-list-item-icon> -->
										</v-list-item>
										<v-divider class="my-0" />
									</template>
								</v-item-group>
							</div>
							</v-list>
						</v-responsive>
					</v-col>
					<v-col cols="auto" class="flex-grow-1 flex-shrink-0">
						<v-responsive v-if="activeChat" class="overflow-y-hidden fill-height" height="500">
							<v-card flat class="d-flex flex-column fill-height">
								<div v-if="activeChat && !parents[activeChat - 1].isGroup" class="d-flex flex-row justify-space-between align-center pa-2 pointer elevation-1 mb-2" style="cursor: pointer;">

									<v-card-title>{{ parents[activeChat - 1].name }}</v-card-title>
									<v-spacer></v-spacer>
									<v-btn icon>
										...
									</v-btn>
								</div>
								<div v-if="activeChat && parents[activeChat - 1].isGroup" @click="openGroupInfoPopup()" class="d-flex flex-row justify-space-between align-center pa-2 pointer elevation-1 mb-2" style="cursor: pointer;">
									<v-card-title >{{ parents[activeChat - 1].name }}</v-card-title>
									<v-spacer></v-spacer>
									<v-btn icon>
										...
									</v-btn>
								</div>
								<!-- <v-card-title v-if="activeChat && parents[activeChat - 1].isGroup" @click="openGroupInfoPopup()">{{ parents[activeChat - 1].name }}</v-card-title> -->
								<v-card-text class="flex-grow-1 overflow-y-auto">
									<template v-for="(msg, i) in messages" :key="`message${i}`">
										<div :class="{ 'd-flex flex-row-reverse': msg.me }">
											<v-menu offset-y>
												<template v-slot:activator="{ on }">
													<v-hover v-slot:default="{ hover }">
														<v-chip :color="msg.me ? 'primary': ''" dark
															style="height:auto;white-space: normal;" class="pa-4 mb-2">
															<p :color="'primary'">
																<b>{{ parents[activeChat - 1].isGroup ? (msg.me ? 'You' :
																	msg.senderName) : "" }}</b>
																<br>
																{{ msg.content }}
															</p>
															<sub class="ml-2" style="font-size: 0.5rem;">{{ msg.createdAt }}</sub>
															<v-icon v-if="hover" small>expand_more</v-icon>
														</v-chip>
													</v-hover>
												</template>
												<v-list>
													<v-list-item>
														<v-list-item-title>delete</v-list-item-title>
													</v-list-item>
												</v-list>
											</v-menu>
										</div>
									</template>
								</v-card-text>
								<v-card-text class="flex-shrink-1">
									<v-text-field v-model="messageForm.content" label="type_a_message" type="text"
										no-details outlined append-outer-icon="send" @keyup.enter="sendMessage"
										@click:append-outer="sendMessage" hide-details />
								</v-card-text>
							</v-card>
						</v-responsive>
					</v-col>
				</v-row>
			</v-container>
		</v-app>
		<GroupCreationDialog ref="groupCreationDialog" />
		<GroupInfoDialog ref="groupInfoDialog" :socketProp="this.socket" :userId="userId" @reload="reloadData"/>
	</div>
</template>
  
<script>
import io from 'socket.io-client';
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/PlayerStore'
import axios from 'axios';
import { ref } from 'vue'
import GroupCreationDialog from './GroupCreationDialog.vue'
import GroupInfoDialog from './GroupInfoDialog.vue'


const { user } = storeToRefs(await usePlayerStore())
const showTime = (date) => {
	console.log("date", date);
	let d = new Date(date);
	let hours = d.getHours();
	let minutes = d.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	let time = hours + ":" + minutes;
	return time;
};

export default {
	components: {
		GroupCreationDialog,
		GroupInfoDialog
		
	},
	data() {
		return {
			activeChat: 0,
			parents: [],
			friends: [],
			groups: [],
			messages: [],
			userId: user.value.id,
			// user: {
			// 	id: user.value.id,
			// 	name: user.value.username,
			// 	imageUrl: user.value.avatar,
			// 	isAdmin: false,
			// 	isMuted: false,
			// 	isBanned: false,
			// },
			messageForm: {
				content: "",
				me: true,
				senderID: user.value.id,
				receiverID: null,
				receiversID: null,
				createdAt: new Date()
			},
			socket: null,
			groupChatDialog: false, // Controls the visibility of the popup
			groupInfoDialog: false, // Controls the visibility of the popup
			groupChatName: '', // Store the group chat name entered by the user

		};
	},
	created() {
		// this.socket = io('ws://localhost:3000',{transports:['websocket']});
		this.socket = io(`ws://${location.hostname}:${import.meta.env.VITE_BACKEND_PORT}`, {
			transports: ['websocket'],
			auth: {
				'token': user.value.token
			}
		});
		try {
			this.socket.emit("getparents", { userId: user.value.id }, (response) => {
				this.parents = response.sortedData;
				this.friends = response.friends;
				this.groups = response.rooms;
			});
		} catch (error) {
			console.error("Error emitting 'getmessagesprivatechat':", error);
		}

		this.socket.on("message", (message) => {
			console.log("parsedData", message);
			const parsedData = JSON.parse(JSON.parse(message).data);
			this.socket.emit("getparents", { userId: user.value.id }, (response) => {
				this.parents = response.sortedData;
				this.friends = response.friends;
				this.groups = response.rooms;
			});
			if (parsedData.senderID == user.value.id) {
				parsedData.me = true;
				// parsedData.sended = true;
			} else {
				parsedData.me = false;
				parsedData.createdAt = showTime(parsedData.createdAt);
				this.messages.push(parsedData);
			}
		});

		this.socket.on("newparent", (parent) => {
			this.parents.unshift(parent);
		});
	},
	mounted() {
		console.log("Chat mounted");
		this.socket.emit("getparents", { userId: user.value.id }, (response) => {
			this.parents = response.sortedData;
			this.friends = response.friends;
			this.groups = response.rooms;
		});
	},
	methods: {
		sendMessage() {
			const newMessage = { ...this.messageForm };
			if (newMessage.content.trim() === "") return;
			if (newMessage.receiverID)
				newMessage.receiverID = this.parents[this.activeChat - 1].id;
			else if (newMessage.groupID)
				newMessage.receiversID = this.parents[this.activeChat - 1].id;
			newMessage.createdAt = new Date();
			console.log("newMessage", newMessage);
			this.socket.send(JSON.stringify({ event: 'message', data: JSON.stringify(newMessage) }));
			this.socket.emit("getparents", { userId: user.value.id }, (response) => {
				this.parents = response.sortedData;
				this.friends = response.friends;
				this.groups = response.rooms;
			});
			newMessage.createdAt = showTime(newMessage.createdAt);
			
			this.messages.push(newMessage);
			this.messageForm.content = "";
		},
		reloadData() {
			this.socket.emit("getparents", { userId: user.value.id }, (response) => {
				this.parents = response.sortedData;
				this.friends = response.friends;
				this.groups = response.rooms;
			});
		},

		activateChat(chatId, index, isGroup) {
			this.activeChat = index + 1;
			this.$refs.groupInfoDialog.user.isAdmin = false;
			this.$refs.groupInfoDialog.user.isMuted = false;
			this.$refs.groupInfoDialog.user.isBanned = false;
			this.fetchMessagesForChat(chatId, isGroup);
		},

		async fetchMessagesForChat(chatId, isGroup) {
			let userId = user.value.id;
			this.messages = [];
			this.messageForm.receiverID = null;
			this.messageForm.receiversID = null;
			if (isGroup)
				this.messageForm.receiversID = chatId;
			else
				this.messageForm.receiverID = chatId;
			try {
				this.socket.emit("getmessages", { userId, chatId, isGroup }, (response) => {
					let messages = response.messages;
					let subscriptions = response.subscriptions;
					console.log("messages", messages);
					console.log("subscriptions", subscriptions);
					for (let i = 0; i < messages.length; i++) {
						if (messages[i].senderID == user.value.id)
							messages[i].me = true;
						else
							messages[i].me = false;
						messages[i].createdAt = showTime(messages[i].createdAt);
					}
					if (isGroup)
					{
						subscriptions.forEach((subscription) => {
							if (subscription.playerID == user.value.id) {
								this.$refs.groupInfoDialog.user.isAdmin = subscription.isAdmin;
								this.$refs.groupInfoDialog.user.isMuted = subscription.isMuted;
								this.$refs.groupInfoDialog.user.isBanned = subscription.isBanned;
							}
						});
					}
					this.messages = messages
				});
			} catch (error) {
				console.error("Error emitting 'getmessagesprivatechat':", error);
			}
		},

		openGroupCreationPopup() {
			this.$refs.groupCreationDialog.groupChatDialog = true;
			this.$refs.groupCreationDialog.friends = this.friends;
			this.$refs.groupCreationDialog.socket = this.socket;
			this.$refs.groupCreationDialog.group.founderId = user.value.id;
		},
		openGroupInfoPopup() {
			this.$refs.groupInfoDialog.groupInfoDialog = true;
			this.socket.emit("getgroupinfo", { groupId: this.parents[this.activeChat - 1].id }, (response) => {
				this.$refs.groupInfoDialog.groupInfo = response;
			});
		},

	},
};
</script>
  
<style scoped>
.v-list-item__subtitle {
	white-space: normal;
}

.v-list-item__title {
	white-space: normal;
}

.chat {
	background-color: aqua;
	/* outline: solid; */
	/* all available screen */
	width: 100%;
	height: 100%;
	overflow-y: hidden;

	/* flexbox */
	display: flex;
	flex-direction: column;
	
}
</style>