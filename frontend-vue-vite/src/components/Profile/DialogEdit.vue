<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
	components: {
	},
	data() {
		return {
			dialogBox: false,
			title: '',

			successUsername: false,
			successMessageUsername: '',
			errorUsername: false,
			errorMessageUsername: '',
			loadingUsername: false,
			
			successAvatar: false,
			successMessageAvatar: '',
			errorAvatar: false,
			errorMessageAvatar: '',
			loadingAvatar: false,
			file: [] as File[],
		}
	},
	methods: {
		displaySuccessAvatar(message: string) {
			this.successAvatar = true
			this.successMessageAvatar = message
		},
		displayErrorAvatar() {
			this.errorAvatar = true
			this.errorMessageAvatar = "Error while loading"
		},
		displaySuccessUsername(message: string) {
			this.successUsername = true
			this.successMessageUsername = message
		},
		displayErrorUsername(message: string) {
			this.errorUsername = true
			this.errorMessageUsername = message
		},
		sendAvatar(){
			// this.displaySuccessAvatar("Successfully uploaded a new avatar picture !")
			this.successAvatar = true
			this.successMessageAvatar = "Successfully uploaded a new avatar picture !"

		},
	},
	watch: {
		successUsername(isActive : boolean) {
			if (isActive == true) {
				this.errorUsername = false
			}
		},
		successAvatar(isActive : boolean) {
			if (isActive == true) {
				this.errorAvatar = false
				this.errorMessageAvatar = ''
			}
		},
		errorAvatar(isActive : boolean) {
			if (isActive == true) {
				this.successAvatar = false
				this.successMessageAvatar = ''
			}
		},
		dialogBox(isActive: boolean) {
			if (isActive == true) {
				this.title = ''

				this.successUsername = false
				this.successMessageUsername = ''
				this.errorUsername = false
				this.errorMessageUsername = ''
				this.loadingUsername = false

				this.successAvatar = false
				this.successMessageAvatar = ''
				this.errorAvatar = false
				this.errorMessageAvatar = ''
				this.loadingAvatar = false

			} 
		}
	},
	mounted() {}
})
</script>

<template>
	<v-dialog v-model="dialogBox" activator="parent">
		<v-card rounded class="dialog bg-white ma-auto pa-4 w-75">
			<v-card-title class="text-button">Edit profile information</v-card-title>



			<v-card-item >
				<h3 class="text-overline">Username</h3>
				<h4 class="font-weight-light">Change your username</h4>
				<v-text-field placeholder="New avatar" density="compact" clearable variant="solo-filled" flat></v-text-field>

				<v-alert v-model="errorUsername" color="error" density="compact" class="my-3">{{ errorMessageUsername }}</v-alert>
				<v-alert v-model="successUsername" color="success" density="compact" class="my-3">{{ successMessageUsername }}</v-alert>

				<v-btn text="Upload" size="x-small" border color="primary" variant="tonal"></v-btn>
			</v-card-item>

			
				<!-- rules="" -->
				<!-- validate-on -->
				<!-- validation-value -->
					<!-- :model-value="" -->

				<v-card-item>
				<h3 class="text-overline">Avatar</h3>
				<h4 class="font-weight-light">Choose an image for your new avatar. Maximum size 2M.</h4>
				<v-file-input
					:loading="loadingAvatar"
					:error="errorAvatar"
					:error-messages="errorMessageAvatar"
					label="upload avatar"
					accept="image/*"
					density="compact"
					chips
					show-size
					prepend-icon="mdi-image-edit"
					color="primary"
					clear-icon="mdi-close-circle-outline"
					variant="outlined" 
					class="my-2"
					@click:prepend="displayErrorAvatar"
					:messages="successMessageAvatar"
				>
				</v-file-input>
				<!-- <div class="align-center justify-center ma-4 d-flex">
					<v-img
						max-width="300"
						aspect-ratio="1"
						:src="file.toString"
					></v-img>
				</div> -->
				<v-btn text="Upload" @click="sendAvatar" size="x-small" border color="primary" variant="tonal"></v-btn>
			</v-card-item>

			<div class="text-end">
				<v-btn text="Done" @click="dialogBox = false" border class="me-4" color="grey" variant="text"></v-btn>
			</div>

		</v-card>
	</v-dialog>
</template>

