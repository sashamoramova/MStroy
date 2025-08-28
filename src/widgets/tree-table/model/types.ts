export interface FlatTreeItem {
  id: string | number;
  parent: string | number | null;
  label: string;
  level: number;
  hasChildren: boolean;
  isExpanded: boolean;
  category: "Группа" | "Элемент";
  [key: string]: any;
}
