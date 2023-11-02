<script lang="ts">
import { RouterView } from 'vue-router'
const debug = false

export default {
	components : {
	},
	data() {
		return {
		}
	},
	computed: {
	},
	methods: {
	},

	beforeCreate() {
		if (debug) console.log('| APP | beforeCreate()')
	},
	created() {
		if (debug) console.log('| APP | created()')
	},
	beforeMount() {
		if (debug) console.log('| APP | beforeMount()')
	},
	mounted() {
		if (debug) console.log('| APP | mounted()')
	},
	beforeUpdate() {
		if (debug) console.log('| APP | beforeUpdate()')
	},
	updated() {
		if (debug) console.log('| APP | updated()')
	},
	beforeUnmount() {
		if (debug) console.log('| APP | beforeUnmount()')
	},
	unmounted() {
		if (debug) console.log('| APP | unmounted()')
	},
}
</script>

<template>
	<v-app>
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
	outline-color: antiquewhite;
}
.v-app {
	background-color: lightslategray;
	outline: solid;
	margin: 0;
	padding: 0;
	outline-color: antiquewhite;
}
.NavSideBar {
	background-color: lightcyan;
	outline: solid;
	outline-color: antiquewhite;
}
.v-bottom-navigation {
	background-color: lemonchiffon;
	outline: solid;
	outline-color: antiquewhite;
}
.parent {
	background-color: lightpink;
	outline: solid;
	padding: 1%;
	margin: 1%;
	outline-color: antiquewhite;
}
.child1 {
	padding: 1%;
	margin: 1%;
	background-color: lightcoral;
	outline: solid;
	outline-color: antiquewhite;
}
.child2 {
	padding: 1%;
	margin: 1%;
	background-color: lightgoldenrodyellow;
	outline: solid;
	outline-color: antiquewhite;
}

.component {
	padding: 2%;
	margin: 2%;
	background-color: lightcyan;
	outline: solid;
	outline-color: antiquewhite;
}

</style>

