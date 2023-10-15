<!-- to convert to composition api -->

<template>
	<v-data-table-server
	  v-model:items-per-page="itemsPerPage"
	  :headers="headers"
	  :items-length="totalItems"
	  :items="serverItems"
	  :loading="loading"
	  class="elevation-1"
	  item-value="name"
	  @update:options="loadItems"
	></v-data-table-server>
  </template>
  
  <script>
	const games = [
	  {
		username: 'Pauline',
		scoreUser: 2,
		scoreOpponent: 3,
		date: '2/23/23',
	  },
	  {
		username: 'Sarah',
		scoreUser: 4,
		scoreOpponent: 3,
		date: '2/23/23',
	  },
	  {
		username: 'Caroline',
		scoreUser: 1,
		scoreOpponent: 1,
		date: '2/23/23',
	  },
	  {
		username: 'Daphné',
		scoreUser: 1,
		scoreOpponent: 4,
		date: '2/23/23',
	  },
	  {
		username: 'Aurélie',
		scoreUser: 1,
		scoreOpponent: 4,
		date: '2/23/23',
	  },
	  {
		username: 'Andrea',
		scoreUser: 1,
		scoreOpponent: 4,
		date: '2/23/23',
	  },
	  {
		username: 'Ludivine',
		scoreUser: 1,
		scoreOpponent: 4,
		date: '2/23/23',
	  },
	  {
		username: 'Murielle',
		scoreUser: 1,
		scoreOpponent: 4,
		date: '2/23/23',
	  },
	]
  
	const FakeAPI = {
	  async fetch({ page, itemsPerPage, sortBy }) {
		return new Promise(resolve => {
		  setTimeout(() => {
			const start = (page - 1) * itemsPerPage
			const end = start + itemsPerPage
			const items = games.slice()
  
			if (sortBy.length) {
			  const sortKey = sortBy[0].key
			  const sortOrder = sortBy[0].order
			  items.sort((a, b) => {
				const aValue = a[sortKey]
				const bValue = b[sortKey]
				return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
			  })
			}
  
			const paginated = items.slice(start, end)
  
			resolve({ items: paginated, total: items.length })
		  }, 500)
		})
	  },
	}
  
	export default {
	  data: () => ({
		itemsPerPage: 5,
		headers: [
		  {
			title: 'Match history',
			align: 'center',
			sortable: false,
			key: 'username',
		  },
		  { title: 'user', key: 'scoreUser', align: 'center' },
		  { title: 'opponent', key: 'scoreOpponent', align: 'center' },
		  { title: 'date', key: 'date', align: 'center' },
		],
		serverItems: [],
		loading: true,
		totalItems: 0,
	  }),
	  methods: {
		loadItems({ page, itemsPerPage, sortBy }) {
		  this.loading = true
		  FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(
			({ items, total }) => {
			  this.serverItems = items
			  this.totalItems = total
			  this.loading = false
			}
		  )
		},
	  },
	}
  </script>
  