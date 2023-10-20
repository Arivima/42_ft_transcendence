<style>

</style>

<template>
	<v-card class="pa-0 ma-0" flat>
		<v-responsive max-width="550" class="">
			<v-dialog

			>
				<template v-slot:activator="{ props }">
					<v-btn v-bind="props" text="Edit profile" prepend-icon="mdi-pencil"></v-btn>
				</template>

				<template v-slot:default="{ isActive }">
					<v-card title="Edit my profile" rounded="lg">
						<v-card-item class="ma-0">
							<v-label class="text-caption text-overline">Change username</v-label>
							<v-text-field density="compact" variant="solo-filled" flat></v-text-field>
							<v-label class="text-caption  text-overline">Change avatar</v-label>
							<v-text-field density="compact" variant="solo-filled" flat></v-text-field>
						</v-card-item>

						<div class="pa-0 ma-4 text-end ">
							<v-btn
								@click="isActive.value = false"
								border
								class="me-4"
								color="grey"
								text="Cancel"
								variant="text"
							></v-btn>

							<v-btn
								@click="isActive.value = false"
								color="grey"
								text="Done"
								variant="flat"
							></v-btn>
						</div>
					</v-card>
				</template>
			</v-dialog>
		</v-responsive>
	</v-card>
  </template>
  
<script lang="ts">
	export default {
		data: () => ({
		}),
	}
</script>