<!-- TODO -->
<!-- link with back
reset component everytime dialogAdd2fa == false -->


<script lang="ts">
import { VOtpInput } from 'vuetify/labs/VOtpInput'
import axios from 'axios'

export default {
	components : {
		VOtpInput,
	},
	props: {
		mode: String, // force (enable | login | disable)
	},
	data() {
		return {
			dialogAdd2fa: false,
			otp: '',
			qrCode: '',
			title: '',
			errorMessage: '',
		}
	},
	methods : {

		async sendOtp() {
			// try {
			// 	let response = (await axios.post(`auth/2fa/`)).data
				
			// }


			try {
			// 	let response
			// 	switch(this.mode) { 
			// 		case 'enable': { 
			// 			response = (await axios.post(`auth/2fa/`))
			// 			break; 
			// 		} 
			// 		case 'login': { 
			// 			response = (await axios.post(`auth/2fa/login`))
			// 			break; 
			// 		} 
			// 		case 'disable': { 
			// 			response = (await axios.delete(`auth/2fa/remove`))
			// 			break; 
			// 		}
			// 	}
			// 	response?.status
			// 	// ok
			// 		this.dialogAdd2fa = false
			// 	// false
			// 		this.errorMessage = "Error: Invalid one time password. Please retry. To generate a new QR code close this window and try again."
			// 	// error
			// 		this.errorMessage = "Error: Server internal error."

			// 		// axios
			// 	// .get('players/me')
			// 	// .then((res) => resolve(res))
			// 	// .catch((err) => reject(err))

				this.errorMessage = "Error: Invalid one time password. Please retry. To generate a new QR code close this window and try again."
					

			} catch (error) {
				console.log(error);
			}
		},
		async getQRcode() {
			try {
				this.qrCode = (await axios.get(`auth/2fa/qrcode`)).data.qrcode
			} catch (error) {
				console.log(error);
			}
		},
	},
	mounted() {
		if (this.mode == 'enable'){
			this.title = "Enable 2 factor authentication"
			this.getQRcode()
		} 
		if (this.mode == 'login')
			this.title = "Confirm login with 2 factor authentication"
		if (this.mode == 'disable')
			this.title = "Disable 2 factor authentication"

			
	}
}
</script>



<template>
	<v-dialog
		v-model="dialogAdd2fa"
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
					@click="dialogAdd2fa = false"
					border
					class="me-4 "
					color="grey"
					text="Cancel"
					variant="text"
				></v-btn>
			</div>
		</v-card>
	</v-dialog>
</template>