<!-- LOGIN -->

<!-- TODO
- responsiveness on screen size : it's popping out
- try to center the button
-->

<script setup lang="ts">
</script>

<template>
	<v-card
		class="backgroundLogin login "
		variant="tonal"
	>
		<v-btn
			prepend-icon="mdi-login"
			href="http://localhost:3000/auth/42"
			text="Login now !"
		>
		</v-btn>
	</v-card>
</template>


<style scoped>

.login {
	background-color: aqua;
	height: 100%;
	width: 100%;
	outline: solid;
	display: flex;
	justify-content: center;
	justify-items: center;
	align-content: center;
	align-items: center;

}

.backgroundLogin {
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(1.1);
    background: url(../../cats_ai.webp) no-repeat center center;
    background-size: cover;
}
    /* background: url( 'https://images.unsplash.com/photo-1636734909254-ff5c43927e10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') no-repeat center center; */
    /* background: url(../../public/cats.jpg) no-repeat center center; */

</style>