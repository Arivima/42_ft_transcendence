<template>
	<v-dialog v-model="groupInfoDialog" max-width="600">
	  <v-card>
		<div class="d-flex justify-space-between align-center pa-2 pointer elevation-1 mb-2">
		  <!-- <v-avatar class="mr-2"> -->
			<v-card-title>{{ groupInfo.name }}</v-card-title>
		</div>
		<v-card-text>
		  <!-- <v-img :src="groupInfo.imageUrl" aspect-ratio="1.5">
		  </v-img> -->
		  <h3>Members</h3>
		  <v-list dense>
			<v-list-item-group class="flex-1 mt-4 mb-4 overflow-y-auto fill-height max-height-400 px-4">
			  <v-list-item v-for="(member, index) in groupInfo.members" :key="index">
				<v-list-item-content>
				  <v-list-item-title>{{ member.name }}</v-list-item-title>
				  <v-list-item-subtitle v-if="member.isAdmin">Administrator</v-list-item-subtitle>
				</v-list-item-content>
				<v-list-item-action class="float-right">
				  <!--  <v-btn @click="viewProfile(member.id)" color="primary" class="mr-2" outlined -->
					<v-btn @click="editProfile(member.id)" color="primary" class="mr-2" outlined>Edit user</v-btn> <!--  TODO: Add this -->
					<v-btn @click="viewProfile(member.id)" color="secondary" class="mr-2" outlined>View Profile</v-btn>
				  <!-- <v-btn @click="viewProfile(member.id)" color="primary" outlined>View Profile</v-btn> -->
				</v-list-item-action>
			  </v-list-item>
			</v-list-item-group>
		  </v-list>
		</v-card-text>
		<v-card-actions>
		  <v-btn color="primary" @click="groupInfoDialog = false">Close</v-btn>
		</v-card-actions>
	  </v-card>
	</v-dialog>
</template>
  
  <script>
  export default {
	data() {
	  return {
		groupInfoDialog: false,
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
	  closeGroupChatPopup() {
		this.groupChatDialog = false;
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