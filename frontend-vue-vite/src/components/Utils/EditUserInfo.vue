<style>

.dialog {
	/* background-color: lightgoldenrodyellow; */
	outline: solid;
	outline-color: antiquewhite;
	min-width: fit-content;
	align-content: center;
	justify-content: center;
	margin: 25%;
}

</style>

<template>
	<div
		class=" pa-0 ma-0  h-100"
		flat
	>
		<v-responsive
			max-width="550"
			class="pa-0 ma-0  h-100"
			
		>
			<v-dialog
				class="pa-0 ma-0  h-100"
			>
				<template v-slot:activator="{ props }">
					<v-btn
						v-bind="props"
						text="Edit profile"
						prepend-icon="mdi-pencil"
						block
						class=" ma-0 h-100"
					> </v-btn>
				</template>

				<template v-slot:default="{ isActive }">
					<v-card
						title="Edit my profile"
						rounded="lg"
						class="dialog"
					>
						<v-card-item
							class="ma-0  h-100"
						>
							<v-label
								text="Username"
								class="text-overline"
							></v-label>
							<v-text-field
								placeholder="New username"
								density="compact"	
								clearable variant="solo-filled"
								flat
							></v-text-field>
							<v-label
								text="Avatar"
								class="text-overline"
							></v-label>
							<v-text-field
								placeholder="New avatar"
								density="compact"
								clearable variant="solo-filled"
								flat
							></v-text-field>
						</v-card-item>

						<div class="pa-0 ma-4 text-end">
							<v-btn
								@click="isActive.value = false"
								border
								class="me-4 "
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
	</div>
  </template>
  
<script lang="ts">
	export default {
		data: () => ({
		}),
	}
</script>