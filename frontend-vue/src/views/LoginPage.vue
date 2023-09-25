<template>
	<div class="flex flex-col h-screen justify-center items-center">
		<!-- Logo -->
		<img src="../assets/logo.png" alt="Logo" class="w-16 h-16 mb-4" />
	
		<!-- Cool Button -->
		<CoolButton buttonText="Login 42!" />
		<ChatTest />

	</div>
</template>
	
<script>
import CoolButton from '@/components/CoolButton.vue';
import ChatTest from '@/components/ChatTest.vue';

export default {
	name: 'LoginPage',
	components: {
    CoolButton,
    ChatTest
},
}
</script>