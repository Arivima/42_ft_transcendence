<template>
	<div id="chat">
		<v-app>
			<v-container class="fill-height pa-0">
				<v-row class="no-gutters elevation-4">
					<v-col cols="12" sm="3" class="flex-grow-1 flex-shrink-0" style="border-right: 1px solid #0000001f;">
						<v-responsive class="overflow-y-auto fill-height" height="500">
							<v-list subheader>
								<v-list-item-group v-model="activeChat">
									<template v-for="(item, index) in parents" :key="`parent${index}`">
										<v-list-item :value="item.id" @click="activateChat(item.id, index)">
											<!-- <v-list-item :value="item.id"> -->
											<v-list-item-avatar color="grey lighten-1 white--text">
												<v-icon>chat_bubble</v-icon>
											</v-list-item-avatar>
											<v-list-item-content>
												<v-list-item-title v-text="item.name" />
												<v-list-item-subtitle v-text="'hi'" />
											</v-list-item-content>
											<v-list-item-icon>
												<v-icon
													:color="item.active ? 'deep-purple accent-4' : 'grey'">chat_bubble</v-icon>
											</v-list-item-icon>
										</v-list-item>
										<v-divider class="my-0" />
									</template>
								</v-list-item-group>
							</v-list>
						</v-responsive>
					</v-col>
					<v-col cols="auto" class="flex-grow-1 flex-shrink-0">
						<v-responsive v-if="activeChat" class="overflow-y-hidden fill-height" height="500">
							<v-card flat class="d-flex flex-column fill-height">
								<!-- <v-card-title>{{ parents[activeChat - 1].name }}</v-card-title> -->
								<!-- <v-card-title>{{ parents[activeChat - 1].name }}</v-card-title> only if activechat is not 0 -->
								<v-card-title v-if="activeChat">{{ parents[activeChat - 1].name }}</v-card-title>
								<v-card-text class="flex-grow-1 overflow-y-auto">
									<template v-for="(msg, i) in messages" :key="`message${i}`">
										<div :class="{ 'd-flex flex-row-reverse': msg.me }">
											<v-menu offset-y>
												<template v-slot:activator="{ on }">
													<v-hover v-slot:default="{ hover }">
														<v-chip :color="msg.me ? 'primary' : ''" dark
															style="height:auto;white-space: normal;" class="pa-4 mb-2"
															v-on="on">
															{{ msg.content }}
															<!-- parse the date to look 23.59 -->
															<!-- <sub class="ml-2" style="font-size: 0.5rem;">{{ msg.createdAt -->
															<sub class="ml-2" style="font-size: 0.5rem;">{{ msg.createdAt
															}}</sub>
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
	</div>
</template>
  
<script>
import io from 'socket.io-client';
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/PlayerStore'
import axios from 'axios';


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
	data() {
		return {
			activeChat: 0,
			parents: [],
			messages: [],
			messageForm: {
				content: "",
				me: true,
				senderID: user.value.id,
				receiverID: 1,
				createdAt: new Date()
			},
			socket: null,
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
				console.log("response", response);
				this.parents = response
			});
		} catch (error) {
			console.error("Error emitting 'getmessagesprivatechat':", error);
		}
		this.socket.on("message", (message) => {
			const parsedData = JSON.parse(JSON.parse(message).data);
			if (parsedData.senderID == user.value.id) {
				parsedData.me = true;
			} else {
				parsedData.me = false;
				parsedData.createdAt = showTime(parsedData.createdAt);
				this.messages.push(parsedData);
			}
		});
	},
	methods: {
		sendMessage() {
			const newMessage = { ...this.messageForm };
			if (newMessage.content.trim() === "") return;
			if (newMessage.receiverID)
				newMessage.receiverID = this.parents[this.activeChat - 1].id;
			this.socket.send(JSON.stringify({ event: 'message', data: JSON.stringify(newMessage) }));
			newMessage.createdAt = showTime(newMessage.createdAt);
			this.messages.push(newMessage);
			this.messageForm.content = "";
		},
		activateChat(chatId, index) {
			this.activeChat = index + 1;
			this.fetchMessagesForChat(chatId);
		},

		async fetchMessagesForChat(chatId) {
			console.log(`Fetching messages for chat ID: ${chatId}`);
			let userId = user.value.id;
			let receiverId = chatId;
			try {
				this.socket.emit("getmessagesprivatechat", { userId, receiverId }, (response) => {
					console.log("response", response);
					for (let i = 0; i < response.length; i++) {
						if (response[i].senderID == user.value.id) {
							response[i].me = true;
						} else {
							response[i].me = false;
						}
						response[i].createdAt = showTime(response[i].createdAt);
					}
					this.messages = response
				});
			} catch (error) {
				console.error("Error emitting 'getmessagesprivatechat':", error);
			}
		},
	},
};
</script>
  
<style scoped>
/* Add your custom styles here */
.v-list-item__subtitle {
	white-space: normal;
}

.v-list-item__title {
	white-space: normal;
}

#chat {
	background-color: aqua;
	/* outline: solid; */
	/* all available screen */
	width: 100%;
}
</style>