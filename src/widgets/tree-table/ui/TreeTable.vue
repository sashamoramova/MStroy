
<template>
  <div class="tree-view-container">
    <div v-if="!rowData || rowData.length === 0" class="no-data">
      Нет данных для отображения
    </div>
    <div v-else class="ag-theme-alpine grid-container">
      <ag-grid-vue
        ref="gridRef"
        class="ag-grid"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        :animateRows="true"
        :suppressDragLeaveHidesColumns="true"
        @grid-ready="onGridReady"
        @cell-clicked="onCellClicked"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { useTreeTable } from '../model/useTreeTable'

const props = defineProps<{
  items: { id: string | number; parent: null | string | number; label: string }[]
}>()

console.log('TreeTable items:', props.items)

const { flatTree, toggleRow } = useTreeTable(props.items)
const gridRef = ref<any>(null)
const rowData = ref<any[]>([])

const gridApi = ref<any>(null)
const gridColumnApi = ref<any>(null)

const columnDefs = ref([
  {
    headerName: '#',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 80,
    maxWidth: 80,
    sortable: false,
    filter: false,
    pinned: 'left',
    lockPinned: true,
    cellStyle: { textAlign: 'center' }
  },
  {
    headerName: 'Название',
    field: 'label',
    flex: 1,
    minWidth: 200,
    cellStyle: (params: any) => ({
      paddingLeft: `${(params.data.level || 0) * 20 + 10}px`,
      fontWeight: params.data.hasChildren ? 'bold' : 'normal'
    })
  },
  {
    headerName: 'ID',
    field: 'id',
    width: 120,
    filter: 'agTextColumnFilter'
  },
  {
    headerName: 'Уровень',
    field: 'level',
    width: 100,
    filter: 'agNumberColumnFilter',
    cellStyle: { textAlign: 'center' }
  },
  {
    headerName: 'Категория',
    field: 'category',
    width: 120,
    filter: 'agTextColumnFilter'
  }
])

const defaultColDef = ref({
  sortable: true,
  filter: true,
  resizable: true,
  editable: false,
  enableRowGroup: false,
  enablePivot: false,
  enableValue: false
})

const onGridReady = (params: any) => {
  console.log('AG Grid ready')
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
  
  if (rowData.value && rowData.value.length > 0) {
    params.api.setRowData(rowData.value)
    
    setTimeout(() => {
      params.api.sizeColumnsToFit()
    }, 50)
  }
}

const onCellClicked = (params: any) => {
  console.log('Cell clicked:', params)
  if (params.column.colId === 'label' && params.data.hasChildren) {
    toggleRow(params.data.id)
    
    setTimeout(() => {
      if (gridApi.value) {
        gridApi.value.setRowData(rowData.value)
      }
    }, 100)
  }
}

watch(flatTree, (newData) => {
  console.log('Flat tree updated:', newData)
  rowData.value = newData || []
  
  if (gridApi.value && newData) {
    nextTick(() => {
      gridApi.value.setRowData(newData)
      gridApi.value.sizeColumnsToFit()
    })
  }
}, { immediate: true })

onMounted(() => {
  console.log('TreeTable mounted')
  
  setTimeout(() => {
    if (gridApi.value && rowData.value.length > 0) {
      console.log('Grid API available, refreshing...')
      gridApi.value.setRowData(rowData.value)
      gridApi.value.sizeColumnsToFit()
    }
  }, 1000)
})
</script>

<style scoped>
.tree-view-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.grid-container {
  width: 100%;
  height: 600px;
}

.ag-grid {
  width: 100%;
  height: 100%;
}

.no-data {
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
}
</style>

<style>
.ag-theme-alpine {
  --ag-header-height: 40px;
  --ag-header-foreground-color: white;
  --ag-header-background-color: #3f51b5;
  --ag-header-cell-hover-background-color: #303f9f;
  --ag-odd-row-background-color: #fafafa;
}

.ag-theme-alpine .ag-header {
  font-weight: 600;
}

.ag-theme-alpine .ag-root-wrapper {
  border: 1px solid #bdc3c7;
  border-radius: 4px;
}

.ag-theme-alpine .ag-cell {
  padding: 8px 12px;
  line-height: 1.4;
}
</style>