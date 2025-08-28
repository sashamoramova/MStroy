import { TreeItem } from '../../entities/tree-store/model/interfaces'

export const buildTree = (items: TreeItem[]): TreeItem[] => {
  if (!items || items.length === 0) return [];

  const itemMap = new Map();
  const roots: TreeItem[] = [];

  // Создаем копии всех элементов с пустыми детьми
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Строим иерархию
  items.forEach(item => {
    if (item.parent === null || item.parent === undefined) {
      roots.push(itemMap.get(item.id));
    } else {
      const parent = itemMap.get(item.parent);
      if (parent) {
        parent.children.push(itemMap.get(item.id));
      }
    }
  });

  return roots;
};

export const getAllChildrenRecursive = (id: TreeItem['id'], items: TreeItem[]): TreeItem[] => {
  const children = items.filter(item => item.parent === id)
  let allChildren = [...children]
  
  children.forEach(child => {
    allChildren = allChildren.concat(getAllChildrenRecursive(child.id, items))
  })
  
  return allChildren
}

export const getAllParentsRecursive = (
  id: TreeItem['id'], 
  itemsMap: Map<TreeItem['id'], TreeItem>
): TreeItem[] => {
  const item = itemsMap.get(id)
  if (!item || item.parent === null) return []
  
  const parent = itemsMap.get(item.parent)
  if (!parent) return []
  
  return [parent, ...getAllParentsRecursive(parent.id, itemsMap)]
}