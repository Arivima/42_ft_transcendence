<script setup lang="ts">
</script>

<template>
	<v-bottom-navigation
      mode="shift"
    >
		<p>Tmp nav</p>

		<router-link
			:to="{name:'home'}"
			custom
			v-slot="{ navigate }"
		>
		<v-btn
			@click="navigate"
			role="link">
			<v-icon>mdi-home</v-icon>
			<span>Home</span>
		</v-btn>
		</router-link>


		<router-link
			:to="{name:'login'}"
			custom
			v-slot="{ navigate }"
		>
		<v-btn
			@click="navigate"
			role="link">
			<v-icon>mdi-login</v-icon>
			<span>Login</span>
		</v-btn>
		</router-link>


		<router-link
			:to="{name:'profile'}"
			custom
			v-slot="{ navigate }"
		>
		<v-btn
			@click="navigate"
			role="link">
			<v-icon>mdi-account</v-icon>
			<span>Profile</span>
		</v-btn>
		</router-link>



		<router-link
			:to="{name:'game'}"
			custom
			v-slot="{ navigate }"
		>
		<v-btn
			@click="navigate"
			role="link">
			<v-icon>mdi-controller</v-icon>
			<span>Game</span>
		</v-btn>
		</router-link>


		<router-link
			:to="{name:'chat'}"
			custom
			v-slot="{ navigate }"
		>
		<v-btn
			@click="navigate"
			role="link">
			<v-icon>mdi-chat</v-icon>
			<span>chat</span>
		</v-btn>
		</router-link>

    </v-bottom-navigation>
</template>


