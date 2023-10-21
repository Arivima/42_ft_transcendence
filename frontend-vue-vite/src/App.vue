<!-- APP -->

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TmpTab from './components/TmpTab.vue'
</script>

<template>
	<v-app>
		<TmpTab/>
		<v-main>
				<RouterView></RouterView>
		</v-main>
	</v-app>
</template>


<style>
.v-app {
	height: 100dvh;
	width: 100dvw;
	align-content: center;
	justify-content: left;
}

.v-main {
	height: 100dvh;
	width: 100dvw;
	align-content: center;
	justify-content: left;
}

/* DEBUG STYLE */
.v-main {
	background-color: lightskyblue;
	outline: solid;
	margin: 0;
	padding: 0;
}
.v-app {
	background-color: lightslategray;
	outline: solid;
	margin: 0;
	padding: 0;
}
.NavSideBar {
	background-color: lightcyan;
	outline: solid;
}
.parent {
	background-color: lightpink;
	outline: solid;
	padding: 1%;
	margin: 1%;
}
.child1 {
	padding: 1%;
	margin: 1%;
	background-color: lightcoral;
	outline: solid;
}
.child2 {
	padding: 1%;
	margin: 1%;
	background-color: lightgoldenrodyellow;
	outline: solid;
}
.component {
	padding: 2%;
	margin: 2%;
	background-color: lightcyan;
	outline: solid;
}

</style>

