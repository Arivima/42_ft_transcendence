<template>
<!-- Your Vue template -->
	<div>
		<input
			type="text"
			v-model="message.message"
			placeholder="Type your message here..."
			class="border border-gray-300 rounded-lg px-4 py-2 w-96"
		/>
		<button
			@click="sendMessage"
			class="bg-blue-500 text-white rounded-lg px-4 py-2 ml-2"
		>
			Send
		</button>
	</div>
</template>

<script>

export default {
data() {
	return {
	message: {
		sender: 'YourSenderName',
		message: '',
	},
	};
},
mounted() {
	// Establish a WebSocket connection
	this.websocket = new WebSocket('ws://localhost:3000/'); // Replace with your actual server URL

	// Listen for WebSocket messages
	this.websocket.addEventListener('message', (event) => {
	// Handle incoming messages here
	const data = JSON.parse(event.data);
	console.log('Received message:', data);
	});
},
methods: {
	sendMessage() {
	// Send a message to the WebSocket server
	console.log('Sending message:', this.message);
	this.websocket.send(JSON.stringify(this.message));

	// Clear the input field
	this.message.message = '';
	},
},
};
</script>