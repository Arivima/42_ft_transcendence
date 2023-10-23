<script lang="ts">
import { defineComponent } from 'vue'
import { VOtpInput } from 'vuetify/labs/VOtpInput'
import axios from 'axios'

export default defineComponent({
	components : {
		VOtpInput,
	},
	props: {
		mode: {
			type: String,
			required: true,
			validator(value : string) {
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
			snackbar: false,
			snackMessage: '',
			errorPopUp: false,
			errorMessage: '',
			loading: false,
		}
	},
	methods : {
		displaySnackbar(message : string) {
			this.snackbar = true
			this.snackMessage = message
		},
		displayError(message : string) {
			this.errorPopUp = true
			this.errorMessage = message
		},
		async getQRcode() {
			this.loading = true
			try {
				this.qrCode = (await axios.get(`auth/2fa/qrcode`)).data.qrcode
				this.loading = false
			} catch (error) {
				console.log(error);
			}
		},
		async sendOtp() {
			this.loading = true
			switch(this.mode) {
				case 'enable' : {
					axios
						.post(`auth/2fa/`)
						.then(response => {
							if (response.data === true){
								this.displaySnackbar("Confirmed authentication. 2 factor authentication has been enabled. Proceeding to app")
								this.dialogBox = false
							}
							else
								this.displayError("Error: Invalid one time password. Please retry. To generate a new QR code close this window and try again.")
						})
						.catch(error => {
							this.displayError("Error: Server internal error.")
							console.log(error)
						})
						.finally(() => this.loading = false)
					break
				}
				case 'login' : {
					axios
						.post(`auth/2fa/login`)
						.then(response => {
							if (response.data === true){
								this.displaySnackbar("Confirmed authentication. Proceeding to app")
								this.dialogBox = false
							}
							else
								this.displayError("Error: Invalid one time password. Please retry. To generate a new QR code close this window and try again.")
						})
						.catch(error => {
							this.displayError("Error: Server internal error.")
							console.log(error)
						})
						.finally(() => this.loading = false)
					break
				}
				case 'disable' : {
					axios
						.delete(`auth/2fa/remove`)
						.then(response => {
							if (response.data === true){
								this.displaySnackbar("Confirmed authentication. 2 factor authentication has been disabled")
								this.dialogBox = false
							}
							else
								this.displayError("Error: Invalid one time password. Please retry. To generate a new QR code close this window and try again.")
						})
						.catch(error => {
							this.displayError("Error: Server internal error.")
							console.log(error)
						})
						.finally(() => this.loading = false)
					break
				}
				default: {
					break
				}
			}
		},
	},
	watch: {
		dialogBox(isActive : boolean){
			if (isActive == true) {
				switch(this.mode) {
					case 'enable' : {
						this.title = "Enable 2 factor authentication"
						this.getQRcode()
						break
					}
					case 'login' : {
						this.title = "Confirm login with 2 factor authentication"
						break
					}
					case 'disable' : {
						this.title = "Disable 2 factor authentication"
						break
					}
					default:
						break
				}
			}
			else {
				this.otp = '',
				this.qrCode = '',
				this.title = '',
				this.errorMessage = '',
				this.snackMessage = '',
				this.loading = false,
			}
		}
	},
	mounted() {
		
	}
})
</script>



<template>
	<v-dialog
		v-model="dialogBox"
		activator="parent"
	>
		<v-card
			:title=title
			rounded
			class="dialog bg-white ma-auto pa-4"
		>
			<v-card-item v-if="qrCode">
				<h3 class="text-overline">QR code</h3>
				<h4 class="font-weight-light">Please scan this QR code in your authentication app</h4>
				<div class="align-center justify-center ma-4 d-flex">
					<v-img
						class="bg-white border"
						max-width="300"
						aspect-ratio="1"
						:src=qrCode
					></v-img>
				</div>
			</v-card-item>
			<v-card-item>
				<h3 class="text-overline">Verification Code</h3>
				<h4 class="font-weight-light">Please enter the verification code from your authentication app</h4>
				<v-alert class="font-weight-light my-2 pa-2" density="compact" color="purple" v-show="errorMessage">{{ errorMessage }}</v-alert>
				<v-otp-input
					v-model="otp"
					class="ma-2"
					length="6"
					variant="outlined"
					@finish="sendOtp"
				></v-otp-input>
				<v-btn
					size="x-small"
					text="reset"
					border
					class="my-2"
					color="grey"
					variant="text"
					@click="otp=''"
				></v-btn>
			</v-card-item>
			<div class="text-end ">
				<v-btn
					@click="dialogBox = false"
					border
					class="me-4 "
					color="grey"
					text="Cancel"
					variant="text"
				></v-btn>
			</div>


				<!-- :timeout="5000" -->
			<v-snackbar
				v-model="snackbar"
				color="success"
				multi-line
				location="top"
			>
			{{ snackMessage }}

			<template v-slot:actions>
					<!-- color="blue" -->
					<!-- variant="text" -->
				<v-btn
					@click="snackbar = false"
				>
				Close
				</v-btn>
			</template>
			</v-snackbar>

				<!-- :timeout="10000" -->
			<v-snackbar
				v-model="errorPopUp"
				color="red-darken-2"
				elevation="24"
				multi-line
				location="bottom"
				location-strategy="connected"
			>
			{{ errorMessage }}

			<template v-slot:actions>
					<!-- color="blue" -->
					<!-- variant="text" -->
				<v-btn
					@click="errorPopUp = false"
				>
				Close
				</v-btn>
			</template>
			</v-snackbar>
		</v-card>
	</v-dialog>
</template>