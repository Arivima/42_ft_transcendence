<template>
	<v-dialog v-model="groupInfoDialog" max-width="600">
		<v-card>
			<div class="d-flex justify-space-between align-center pa-2 pointer elevation-1 mb-2">
				<!-- <v-avatar class="mr-2"> -->
				<v-card-title>{{ groupInfo.name }}</v-card-title>
				<v-btn icon @click="addusertogroup()" v-if="this.user.isAdmin">
					<v-icon>mdi-account-plus</v-icon>
				</v-btn>
			</div>
			<v-card-text>
				<!-- <v-img :src="groupInfo.imageUrl" aspect-ratio="1.5">
		  </v-img> -->
				<h3>Members</h3>
				<v-list dense>
					<div class="flex-1 mt-4 mb-4 overflow-y-auto fill-height max-height-400 px-4">
						<v-list-item v-for="(member, index) in groupInfo.members" :key="index">
							<v-list-item-title>{{ member.name }}</v-list-item-title>
							<v-list-item-subtitle v-if="member.isAdmin">Administrator</v-list-item-subtitle>
							<v-list-item-action class="float-right">
								<PopUpUserEdit ref="select" :userInfos="member" :socket="socket" :groupId="groupInfo.id" v-if="this.user.isAdmin && member.id !== this.userId"/>
								<v-btn @click="viewProfile(member.id)" color="secondary" class="mr-2" outlined>
									View Profile
								</v-btn>
							</v-list-item-action>
						</v-list-item>
					</div>
				</v-list>
			</v-card-text>
			<v-card-actions>
				<v-btn color="primary" @click="groupInfoDialog = false">Close</v-btn>
				<v-btn color="red" @click="leaveGroup" class="ml-2 float-right">Leave Group</v-btn>
			</v-card-actions>
		</v-card>
		<GroupAddUserDialog ref="groupAddUserDialog" :socketProp="this.socket" :groupId="this.groupInfo.id" :userId="userId"/>
	</v-dialog>
</template>

<script>
import PopUpUserEdit from './PopUpUserEdit.vue';
import GroupAddUserDialog from './GroupAddUserDialog.vue';

export default {
	props: {
		socketProp: {
			type: Object,
			default: null,
		},
		userIdProp: {
			type: Number,
			default: 0,
		},
	},
	created() {
		this.socket = this.$props.socketProp;
		this.userId = this.$props.userIdProp
		this.socket.on("removeuserfromgroup", (data) => {
			if (data.success == false) {
				alert("You are not allowed to remove this user");
				this.$emit("reload");
		}

			console.log("removeuserfromgroup", data);
			if (data.groupId === this.groupInfo.id) {
				this.groupInfo.members = this.groupInfo.members.filter((member) => member.id !== data.userId);
			}
		});


		this.socket.on("addusertogroup", (data) => {
			if (data.groupId === this.groupInfo.id) {
				let users = data.newUsers.map((user) => {
					console.log("user", user);
					return {
						id: user.player.id,
						name: user.player.username,
						imageUrl: user.player.avatar,
						isAdmin: false,
						isMuted: false,
					};
				});
				this.groupInfo.members = [...this.groupInfo.members, ...users];
			}
		});
		

		this.socket.on("editusersubscription", (data) => {
			if (data.groupId === this.groupInfo.id) {
				console.log("editusersubscription", data);
				this.groupInfo.members = this.groupInfo.members.map((member) => {
					if (member.id === data.userId) {
						member.isMuted = data.isMuted;
						member.isAdmin = data.isAdmin;
					}
					if (data.userId === this.userId) {
						this.user.isMuted = data.isMuted;
						this.user.isAdmin = data.isAdmin;
					}
					return member;
				});
			}
		});
	},
	components: {
		PopUpUserEdit,
		GroupAddUserDialog,
	},
	data() {
		return {
			groupInfoDialog: false,
			toggleSelect: false,
			socket: null,
			userId: 0,
			user: {},
			groupInfo: {
				name: '',
				imageUrl: '',
				founder: '',
				members: [],
			},
		};
	},
	computed: {
		groupImage() {
			return this.groupInfo.groupImage;
		},
		groupMembers() {
			return this.groupInfo.groupMembers;
		},
	},
	methods: {
		viewProfile(member) {
			window.open(`http://localhost:8080/profile/${member}`, '_blank');
		},
		editProfile() {
			this.$refs.select.onClick((e) => {
				console.log(e);
			});
		},
		addusertogroup() {
			this.$refs.groupAddUserDialog.groupAddUserDialog = true;
			console.log("this.$refs.groupAddUserDialog", this.userId, this.groupInfo.id);
			this.socket.emit("getfriendsnotingroup", { userId: this.userId, groupId: this.groupInfo.id }, (response) => {
				this.$refs.groupAddUserDialog.friends = response.friends;
			});
		},
		leaveGroup() {
			this.socket.emit("removemefromgroup", { groupId: this.groupInfo.id }, (response) => {
				// console.log("response removemefromgroup", response);
				if (response.success == false)
					alert("You not allowed to leave this group");
				
				this.$emit("reload");
				this.groupInfoDialog = false;
			});
		},
		openGroupInfoPopup(group) {
		},

		openGroupChatPopup(group) {
		},
		closeGroupChatPopup() {
			this.groupInfoDialog = false;
		},
	},
};
</script>
  
<style scoped>
.group-image {
	width: 100%;
	max-height: 200px;
	object-fit: cover;
}
</style>