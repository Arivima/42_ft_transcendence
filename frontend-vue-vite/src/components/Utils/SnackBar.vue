<!-- // WIP VERSION DO NOT USE -->

<script lang="ts">

const debug = false

export default {
	props: {
		snackbar: {
			type: Boolean,
			required: true
		},
		snackbarText: {
			type: String,
			required: true
		},
	},
	data() {
		return {
		}
	},
	computed: {
	},
	methods: {
		closeSnackbar(){
			this.$emit('add-counter', this.taskId);
		}
	}
}
</script>

<template>
	<v-snackbar
	v-model="snackbar"
	timeout=10000
	location="top"
	color="primary"
	rounded="xl"
>
	{{ snackbarText }}
	<template v-slot:actions>
		<v-btn
			color="white"
			variant="tonal"
			@click="snackbar = false"
			rounded="xl"
		>
			Close
		</v-btn>
	</template>
</v-snackbar>
</template>