import { useState, useRef, useEffect } from "react";

export function useTableNameEditor() {
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTableId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTableId]);

  const startEditing = (tableId: string, currentName: string) => {
    setEditingTableId(tableId);
    setEditingName(currentName);
  };

  const cancelEditing = () => {
    setEditingTableId(null);
    setEditingName("");
  };

  const saveEditing = (onSave: (tableId: string, name: string) => void) => {
    if (editingTableId && editingName.trim()) {
      onSave(editingTableId, editingName.trim());
      cancelEditing();
    }
  };

  return {
    editingTableId,
    editingName,
    setEditingName,
    inputRef,
    startEditing,
    cancelEditing,
    saveEditing,
    isEditing: (tableId: string) => editingTableId === tableId,
  };
}
