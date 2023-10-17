<script setup lang="ts">
const props = defineProps({
  // Required prop
  icon: {
    type: String,
    required: true,
  },
  // Optional prop
  routeTo: {
    type: String as PropType<string | undefined>,
    default: undefined,
  },
});
</script>

<template>
	<router-link
		:to="{name:'routeTo'}"
	>
		<v-btn
			role="link"
			:icon="icon"
			size="x-small"
			variant="tonal">
		</v-btn>
	</router-link>
</template>