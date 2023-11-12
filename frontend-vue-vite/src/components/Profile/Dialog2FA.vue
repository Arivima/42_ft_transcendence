<script lang="ts">
import { defineComponent } from 'vue'
import { VOtpInput } from 'vuetify/labs/VOtpInput'
import axios from 'axios'
const debug = false

export default defineComponent({
	components: {
		VOtpInput
	},
	props: {
		mode: {
			type: String,
			required: true,
			validator(value: string) {
				return ['enable', 'login', 'disable'].includes(value)
			}
		}
	},
	data() {
		return {
			dialogBox: false,
			otp: '',
			qrCode: '',
			title: '',
			success: false,
			successMessage: '',
			error: false,
			errorMessage: '',
			loading: false,
		}
	},
	methods: {
		resetOtp(){
			this.otp = ''
			this.error = false			
		},
		displaySuccess(message: string) {
			this.success = true
			this.successMessage = message
		},
		displayError(message: string) {
			this.error = true
			this.errorMessage = message
			this.otp = ''
		},
		async getQRcode() {
			this.loading = true
			axios
				.get(`auth/2fa/qrcode`)
				.then((response) => {this.qrCode = response.data.qrcode})
				.catch((error) => {
					this.displayError('Error: Server internal error.')
					console.log(error)
				})
				.finally(() => (this.loading = false))
		},
		async sendOtp() {
			this.loading = true
			switch (this.mode) {
				case 'enable': {
					axios
						.post(`auth/2fa`, {
							otp : this.otp
						})
						.then((response) => {
							if (response.data === true)
								this.displaySuccess('Enabled 2FA.')
							else
								this.displayError('Error: Invalid one time password. Please retry.')
						})
						.catch((error) => {
							this.displayError('Error: Server internal error.')
							console.log(error)
						})
						.finally(() => (this.loading = false))
					break
				}
				case 'login': {
					axios
						.post(`auth/2fa/login`, {
							otp : this.otp
						})
						.then((response) => {
							if (response.data === true){
								this.displaySuccess('Confirmed authentication.')
								this.$router.push({name: 'home'})
							}
							else
								this.displayError('Error: Invalid one time password. Please retry.')
						})
						.catch((error) => {
							this.displayError('Error: Server internal error.')
							console.log(error)
						})
						.finally(() => (this.loading = false))
					break
				}
				case 'disable': {
					axios
						.post(`auth/2fa/remove`, {
								otp : this.otp
							})
						.then((response) => {
							if (response.data === true)
								this.displaySuccess('Disabled 2FA.')
							else
								this.displayError('Error: Invalid one time password. Please retry.')
						})
						.catch((error) => {
							this.displayError('Error: Server internal error.')
							console.log(error)
						})
						.finally(() => (this.loading = false))
					break
				}
				default: {
					break
				}
			}
		}
	},
	watch: {
		success(isActive : boolean) {
			if (isActive == true) {
				this.error = false
			}
		},
		dialogBox(isActive: boolean) {
			if (isActive == true) {
				this.otp = ''
				this.qrCode = ''
				this.title = ''
				this.error = false
				this.success = false
				this.loading = false				
				switch (this.mode) {
					case 'enable': {
						this.title = 'Enable 2 factor authentication'
						this.getQRcode()
						break
					}
					case 'login': {
						this.title = 'Confirm login with 2 factor authentication'
						break
					}
					case 'disable': {
						this.title = 'Disable 2 factor authentication'
						break
					}
					default:
						break
				}
			} 
		}
	},
	mounted() {}
})
</script>

<template>
	<v-dialog v-model="dialogBox" activator="parent">
		<v-card rounded class="dialog bg-white ma-auto pa-4" :loading="loading">
			<v-card-title class="text-button">{{ title }}</v-card-title>
			<v-card-item v-show="qrCode">
				<h3 class="text-overline">QR code</h3>
				<h4 class="font-weight-light">
					Please scan this QR code in your authentication app
				</h4>
				<div class="align-center justify-center ma-4 d-flex">
					<v-img
						max-width="300"
						aspect-ratio="1"
						:src="qrCode"
					></v-img>
				</div>
				<v-btn text="generate new QR code" @click="getQRcode" size="x-small" border class="my-2" color="grey" variant="text"></v-btn>
			</v-card-item>
			<v-card-item>
				<h3 class="text-overline">Verification Code</h3>
				<h4 class="font-weight-light">
					Please enter the verification code from your authentication app
				</h4>
				<v-otp-input
					v-model="otp"
					variant="outlined"
					@finish="sendOtp"
					:error=Boolean(error)
					></v-otp-input>
				<v-btn text="reset" @click="resetOtp" size="x-small" border class="my-2" color="grey" variant="text"></v-btn>
				<v-alert v-model="error" color="error" density="compact" class="my-3">{{ errorMessage }}</v-alert>
				<v-alert v-model="success" color="success" density="compact" class="my-3">{{ successMessage }}</v-alert>
			</v-card-item>
			<div class="text-end">
				<v-btn text="Close" @click="dialogBox = false" border class="me-4" color="primary" variant="tonal"></v-btn>
			</div>
		</v-card>
	</v-dialog>
</template>



			<!-- <v-snackbar
				v-model="success"
				color="purple"
				elevation="24"
				multi-line
				location="bottom"

				:timeout="10000"
			>
				{{ successMessage }}
				<template v-slot:actions>
					<v-btn text="Close" @click="success = false" color="white" variant="tonal"></v-btn>
				</template>
			</v-snackbar> -->


			<!-- <v-snackbar
				v-model="error"
				color="error"
				elevation="24"
				multi-line
				location="center"
				:timeout="10000"
			>
				{{ errorMessage }}
				<template v-slot:actions>
					<v-btn text="Close" @click="error = false" color="white" variant="tonal"></v-btn>
				</template>
			</v-snackbar> -->