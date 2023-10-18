<!-- LOGIN -->

<!-- TODO
- responsiveness on screen size : it's popping out
- try to center the button
-->

<script setup lang="ts">
</script>

<template>
	<div class="login">
		<!-- <span class="background"></span> -->
		<v-main >
			<v-container
				class="d-flex align-center justify-center fill-height pa-0 ma-0"
				fluid
			>
				<v-btn
					prepend-icon="mdi-login"
					href="http://localhost:3000/auth/42"
					color="white"
				>
					Login now !
				</v-btn>
			</v-container>
		</v-main>
	</div>
</template>


<style scoped>

.login {
	background-color: aqua;
	outline: solid;
}
.background {
    width: 100%;
    height: 100%; 
    position: absolute;
    top: 0;
    left: 0;
    background: url( 'https://images.unsplash.com/photo-1636734909254-ff5c43927e10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') no-repeat center center;
    background-size: cover;
    background-color: white;
    transform: scale(1.1);
  }

</style>