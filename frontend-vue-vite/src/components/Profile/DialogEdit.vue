<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
	components: {
	},
	data() {
		return {
			dialogBox: false,
			// USERNAME
			username: '',
			isValidUsername : false,
			loadingUsername: false,
			successUsername: false,
			successMessageUsername: '',
			errorUsername: false,
			errorMessageUsername: '',
			validationForm : false,
			usernameRules: [
				(value : string) => (value && value.length <= 15) || 'Name must be less than 15 characters',
				(value : string) => (value && value.length >= 5) || 'Name must be at least 5 characters',
			],
			// AVATAR
			file: [] as File[],
			avatar: '',
			loadingAvatar: false,
			successAvatar: false,
			successMessageAvatar: '',
			errorAvatar: false,
			errorMessageAvatar: '',
			AvatarRules: [
				(value : File[]) => {
					return !value || !value.length || value[0].size < 2000000 || 'Avatar size should be less than 2 MB!'
				},
			],
			// for debug
			that : this,
		}
	},
	methods: {
		async validate () {
			await this.$refs.form.validate()
			this.isValidUsername = this.$refs.form.isValid
		},
		reset () {
			this.$refs.form.reset()
		},
		// isValid () : Boolean {
		// 	console.log("isValid ? " + this.$refs.form.isValid)
		// 	return this.$refs.form.isValid
		// },
		// displaySuccessAvatar(message: string) {
		// 	this.successAvatar = true
		// 	this.successMessageAvatar = message
		// },
		// displayErrorAvatar() {
		// 	this.errorAvatar = true
		// 	this.errorMessageAvatar = "Error while loading"
		// },
		displaySuccessUsername(message: string) {
			this.successUsername = true
			this.successMessageUsername = message
		},
		// displayErrorUsername(message: string) {
		// 	this.errorUsername = true
		// 	this.errorMessageUsername = message
		// },
		sendUsername(){
			this.loadingUsername = true
			var that = this;
			setTimeout(function() { 
				that.successUsername = true
				that.successMessageUsername = "Successfully uploaded a new username !"
				that.loadingUsername = false
			}, 10000);

		},
		sendAvatar(){
			this.loadingAvatar = true
			var that = this;
			setTimeout(function() { 
				that.successAvatar = true
				that.successMessageAvatar = "Successfully uploaded a new avatar picture !"
				that.loadingAvatar = false
			}, 10000);

		},
		onFileInput(event : any) {
			if (this.errorAvatar == true)
				this.errorAvatar = false
			if (true == (!event.target.files || !event.target.files.length || event.target.files[0].size >= 2000000))
				this.errorAvatar = true
			else {
				const data = URL.createObjectURL(event.target.files[0])
				this.avatar = data
			}
		},
		onFileRemove() {    	   
			this.avatar = ''
			this.errorAvatar = false
		}
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
			} else {
				this.successMessageAvatar = ''
			}
		},
		errorAvatar(isActive : boolean) {
			if (isActive == true) {
				this.successAvatar = false
				this.successMessageAvatar = ''
			} else {
				this.errorMessageAvatar = ''
			}
		},
		// reset variables when dialog is opened
		dialogBox(isActive: boolean) {
			if (isActive == true) {
				this.username = ''
				this.isValidUsername = false
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
				this.avatar = ''

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
				<v-form
					ref="form"
				>
					<v-text-field
						v-model="username"
						:loading="loadingUsername"
						:counter="15"
						:rules="usernameRules"
						clearable
						@click:clear="reset()"
						@update:model-value="validate()"
						:messages="successMessageAvatar"

						label="Username"
						placeholder="Choose username"
						density="compact" 
						color="primary"
						prepend-icon="mdi-account-edit"
						clear-icon="mdi-close-circle-outline"
						variant="outlined"
						class="my-2"
					></v-text-field>
					<!-- TODO -->
					<v-btn text="Upload" @click="sendUsername" size="x-small" border color="primary" variant="tonal"></v-btn>
				</v-form>
				<v-alert v-model="errorUsername" color="error" density="compact" class="my-3">{{ errorMessageUsername }}</v-alert>
				<v-alert v-model="successUsername" color="success" density="compact" class="my-3">{{ successMessageUsername }}</v-alert>
			</v-card-item>

			
				<!-- accept="image/png, image/jpeg, image/bmp" -->
				<v-card-item>
				<h3 class="text-overline">Avatar</h3>
				<h4 class="font-weight-light">Choose an image for your new avatar. Maximum size 2M.</h4>
				<v-file-input
					:model-value="file"
					:loading="loadingAvatar"
					:error="errorAvatar"
					:error-messages="errorMessageAvatar"
					accept="image/*"
					:rules="AvatarRules"
					:messages="successMessageAvatar"
					@click:clear="onFileRemove()"
					@change="onFileInput($event)"
					

					label="Choose avatar"
					density="compact"
					chips
					show-size
					color="primary"
					prepend-icon="mdi-image-edit"
					clear-icon="mdi-close-circle-outline"
					variant="outlined" 
					class="my-2"
				>
				</v-file-input>
			</v-card-item>

			<v-expand-transition>
				<v-card-item v-show="avatar" >
					<div class="align-center justify-center pa-0 ma-0 d-flex flex-column ">
						<h4 class="font-weight-light mb-4">Preview</h4>
						<v-avatar
							:image="avatar"
							size="200"
							variant="elevated"
						>
						</v-avatar>
					</div>
					<v-card-text class="px-0 font-weight-light ">Click on 'upload' to confirm the change</v-card-text>
					<v-btn text="Upload" @click="sendAvatar" size="x-small" border color="primary" variant="tonal"></v-btn>
				</v-card-item>
			</v-expand-transition>

			<div class="text-end">
				<v-btn text="Done" @click="dialogBox = false" border class="me-4" color="primary" variant="tonal"></v-btn>
			</div>



			<v-card-item title="debug">
					<p> dialogBox : {{ dialogBox }}</p>
					<p> successUsername : {{ successUsername }}</p>
					<p> successMessageUsername : {{ successMessageUsername }}</p>
					<p> errorUsername : {{ errorUsername }}</p>
					<p> errorMessageUsername : {{ errorMessageUsername }}</p>
					<p> loadingUsername : {{ loadingUsername }}</p>
					<p> username : {{ username }}</p>
					<p> isValidUsername : {{ isValidUsername }}</p>

					<!-- <p>file ? : {{ file.length ? file[0]  : 'empty' }}</p>
					<p> dialogBox : {{ dialogBox }}</p>
					<p> successAvatar : {{ successAvatar }}</p>
					<p> successMessageAvatar : {{ successMessageAvatar }}</p>
					<p> errorAvatar : {{ errorAvatar }}</p>
					<p> errorMessageAvatar : {{ errorMessageAvatar }}</p>
					<p> loadingAvatar : {{ loadingAvatar }}</p>
					<p> avatar : {{ avatar }}</p> -->

				</v-card-item>
		</v-card>
	</v-dialog>
</template>

<style scoped>

</style>