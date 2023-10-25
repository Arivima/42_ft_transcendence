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
			success: false,
			successMessage: '',
			error: false,
			errorMessage: '',
			loading: false,
		}
	},
	methods: {
		displaySuccess(message: string) {
			this.success = true
			this.successMessage = message
		},
		displayError(message: string) {
			this.error = true
			this.errorMessage = message
		},
	},
	watch: {
		success(isActive : boolean) {
			if (isActive == true) {
				this.error = false
			}
		},
		dialogBox(isActive: boolean) {
			if (isActive == true) {
				this.title = ''
				this.error = false
				this.success = false
				this.loading = false				
			} 
		}
	},
	mounted() {}
})
</script>

<template>
	<v-dialog v-model="dialogBox" activator="parent">
		<v-card rounded class="dialog bg-white ma-auto pa-4" :loading="loading">
			<v-card-title class="text-button">Edit profile information</v-card-title>

<!-- 
			<v-file-input
				append-icon=""
				append-inner-icon=""
				base-color=""
				bg-color=""
				center-affix
				chips
				clearable
				clear-icon=""
				color=""
				density="compact"
				direction="vertical"
				dirty
				:error="error"
				:error-messages="errorMessage"
				focused
				:loading="loadingFile"
				prepend-icon=""
				prepend-inner-icon=""
				rounded=""
				rules=""
				show-size=""
				single-line=""
				
			>
			</v-file-input> -->


			<v-card-item >
				<h3 class="text-overline">Username</h3>
				<h4 class="font-weight-light">Change your username</h4>
				<v-text-field placeholder="New username" density="compact" clearable variant="solo-filled" flat ></v-text-field>
	
				<v-alert v-model="error" color="error" density="compact" class="my-3">{{ errorMessage }}</v-alert>
				<v-alert v-model="success" color="success" density="compact" class="my-3">{{ successMessage }}</v-alert>

				<v-btn text="Upload" size="x-small" border color="primary" variant="tonal"></v-btn>
			</v-card-item>

			

			<v-card-item>
				<h3 class="text-overline">Avatar</h3>
				<h4 class="font-weight-light">Change your avatar</h4>
				<v-text-field placeholder="New avatar" density="compact" clearable variant="solo-filled" flat></v-text-field>
				<v-btn text="Upload" size="x-small" border color="primary" variant="tonal"></v-btn>
			</v-card-item>

			<div class="text-end">
				<v-btn text="Done" @click="dialogBox = false" border class="me-4" color="grey" variant="text"></v-btn>
			</div>

		</v-card>
	</v-dialog>
</template>

