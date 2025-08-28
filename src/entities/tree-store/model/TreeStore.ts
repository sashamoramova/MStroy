import { TreeItem, TreeStoreInterface } from "./interfaces";
import {
  buildTree,
  getAllChildrenRecursive,
  getAllParentsRecursive,
} from "../../../shared/lib/tree-utils";

export class TreeStore implements TreeStoreInterface {
  private items: TreeItem[];
  private itemsMap: Map<TreeItem["id"], TreeItem>;

  constructor(items: TreeItem[]) {
    this.items = [...items];
    this.itemsMap = new Map();
    this.buildItemsMap();
  }

  private buildItemsMap(): void {
    this.itemsMap.clear();
    this.items.forEach((item) => {
      this.itemsMap.set(item.id, item);
    });
  }

  getAll(): TreeItem[] {
    return [...this.items];
  }

  getItem(id: TreeItem["id"]): TreeItem | undefined {
    return this.itemsMap.get(id);
  }

  getChildren(id: TreeItem["id"]): TreeItem[] {
    return this.items.filter((item) => item.parent === id);
  }

  getAllChildren(id: TreeItem["id"]): TreeItem[] {
    return getAllChildrenRecursive(id, this.items);
  }

  getAllParents(id: TreeItem["id"]): TreeItem[] {
    return getAllParentsRecursive(id, this.itemsMap);
  }

  addItem(item: TreeItem): void {
    this.items.push(item);
    this.itemsMap.set(item.id, item);
  }

  removeItem(id: TreeItem["id"]): void {
    const itemsToRemove = this.getAllChildren(id);
    const itemToRemove = this.getItem(id);

    if (itemToRemove) {
      itemsToRemove.push(itemToRemove);
    }

    this.items = this.items.filter(
      (item) => !itemsToRemove.some((removeItem) => removeItem.id === item.id)
    );

    itemsToRemove.forEach((item) => this.itemsMap.delete(item.id));
  }

  updateItem(updatedItem: TreeItem): void {
    const index = this.items.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) {
      this.items[index] = updatedItem;
      this.itemsMap.set(updatedItem.id, updatedItem);
    }
  }

  getTree(): TreeItem[] {
    return buildTree(this.items);
  }

  // Добавьте метод:
  // getRootItems(): TreeItem[] {
  //   return this.items.filter(
  //     (item) => item.parent === null || item.parent === undefined
  //   );
  // }
}
