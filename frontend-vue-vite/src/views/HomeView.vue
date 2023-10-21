<!-- <script lang="ts">
export default {
  data() {
    return {
      loading: false,
      user: null,
      error: null,
    }
  },
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchData()
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
  methods: {
    fetchData() {
      this.error = this.user = null
      this.loading = true
      // replace `getPost` with your data fetching util / API wrapper
      getPost(this.$route, (err, user) => {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.user = user
        }
      })
    },
  },
}
</script> -->

<template>
  <div class="home">
	<!-- <div>
		<button @click="goToLandingPage">Go to Landing Page</button>
	</div>

	<div class="user">
		<div v-if="loading" class="loading">Loading...</div>

		<div v-if="error" class="error">{{ error }}</div>

		<div v-if="user" class="content">
		<h2>{{ user.username }}</h2>
		<p>{{ user.firstName }}</p>
		</div>
	</div> -->

  </div>

</template>


<style scoped>
.home {
	background-color: aqua;
	outline: solid;
}
</style>


<!-- export default {
	computed: {
	  username() {
		return this.$route.params.username
	  },
	},
	methods: {
	  goToLandingPage() {
		if (isAuthenticated) {
		  this.$router.push('/game')
		} else {
		  this.$router.push('/login')
		}
	  },
	},
  } -->