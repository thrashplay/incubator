export interface Option {
  icon: string
  id: string
}

export interface ToolSelectorProps {
  onSelect: (id: string) => void
  selectedId?: string
  options: readonly Option[]
}
