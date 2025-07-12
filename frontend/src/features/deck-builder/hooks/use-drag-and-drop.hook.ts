import { useState } from "react";
import { useSensors, useSensor, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { SanityDocument } from "next-sanity";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";

interface UseDragAndDropProps {
  onCreateTableWithProfile: (profileId: string) => void;
  onUpdateTableProfiles: (tableId: string, profiles: string[]) => void;
  profileTables: ProfileIdentifierTable[];
}

export function useDragAndDropHook({
  onCreateTableWithProfile,
  onUpdateTableProfiles,
  profileTables,
}: UseDragAndDropProps) {
  const [activeDragProfile, setActiveDragProfile] =
    useState<SanityDocument | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current) {
      setActiveDragProfile(active.data.current.profile);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragProfile(null);

    if (over && active.data.current) {
      const profileId = active.id as string;
      const targetId = over.id as string;

      if (targetId === "new-group-creator") {
        onCreateTableWithProfile(profileId);
      } else if (targetId.startsWith("table-")) {
        const tableId = targetId.replace("table-", "");
        const targetTable = profileTables.find((table) => table.id === tableId);

        if (targetTable && !targetTable.profiles.includes(profileId)) {
          onUpdateTableProfiles(tableId, [...targetTable.profiles, profileId]);
        }
      }
    }
  };

  const handleDragCancel = () => {
    setActiveDragProfile(null);
  };

  return {
    activeDragProfile,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}
