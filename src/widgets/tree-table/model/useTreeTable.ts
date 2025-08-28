import { ref, computed } from "vue";
import { buildTree } from "@/shared/lib/tree-utils";
import { TreeItem } from "@/entities/tree-store/model/interfaces";
import { FlatTreeItem } from "./types";

export const useTreeTable = (initialItems: TreeItem[]) => {
  const expandedRows = ref<Set<string | number>>(new Set());

  const flatTree = computed<FlatTreeItem[]>(() => {
    if (!initialItems || initialItems.length === 0) return [];

    try {
      const tree = buildTree(initialItems);
      
      const flatten = (items: TreeItem[], level = 0): FlatTreeItem[] => {
        return items.flatMap(item => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedRows.value.has(item.id);
          
          const flatItem: FlatTreeItem = {
            id: item.id,
            parent: item.parent,
            label: item.label,
            level,
            hasChildren,
            isExpanded,
            category: hasChildren ? "Группа" : "Элемент"
          };

          const children = hasChildren && isExpanded 
            ? flatten(item.children, level + 1)
            : [];

          return [flatItem, ...children];
        });
      };

      return flatten(tree);
    } catch (error) {
      console.error('Error building tree:', error);
      return [];
    }
  });

  const toggleRow = (id: string | number) => {
    const newSet = new Set(expandedRows.value);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    expandedRows.value = newSet;
  };

  return {
    flatTree,
    toggleRow,
  };
};