export type  TreeItem = {
  id: string | number
  parent: string | number | null
  label: string
  children?: TreeItem[]; // ✅ Обязательно!
  [key: string]: any
}

export type  TreeStoreInterface = {
  getAll(): TreeItem[]
  getItem(id: TreeItem['id']): TreeItem | undefined
  getChildren(id: TreeItem['id']): TreeItem[]
  getAllChildren(id: TreeItem['id']): TreeItem[]
  getAllParents(id: TreeItem['id']): TreeItem[]
  addItem(item: TreeItem): void
  removeItem(id: TreeItem['id']): void
  updateItem(item: TreeItem): void
}