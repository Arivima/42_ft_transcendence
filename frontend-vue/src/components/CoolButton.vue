<template>
  <a href="http://localhost:3000/auth/42">
    <button
      class="cool-button"
      @click="onClick"
    >
      {{ buttonText }}
    </button>
  </a>
  <!-- <button
    class="cool-button"
    @click="onClick"
  >
    {{ buttonText }}
  </button> -->
</template>

<script>
import axios from 'axios';

export default {
  name: 'CoolButton',
  props: {
    buttonText: String,
  },
  methods: {
    async onClick() {
      try {
        const response = await axios.get( this.$apiKey + '/auth/42', {});
        // Handle the response here
        console.log(response.data);
      } catch (error) {
        // Handle errors here
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.cool-button {
  @apply px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out;
}
</style>