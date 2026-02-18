import { useEffect, useRef, useState } from 'react';
import { useUpdateRetroRoomName } from '../api/team.mutations';

interface TeamNameProps {
  teamId: number;
  teamName: string;
  isEditing: boolean;
  onEditEnd: () => void;
}

export function TeamName({ teamId, teamName, isEditing, onEditEnd }: TeamNameProps) {
  const [editValue, setEditValue] = useState(teamName);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateMutation = useUpdateRetroRoomName();

  useEffect(() => {
    setEditValue(teamName);
  }, [teamName]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    onEditEnd();
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== teamName) {
      updateMutation.mutate({ retroRoomId: teamId, name: trimmed });
    } else {
      setEditValue(teamName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setEditValue(teamName);
      onEditEnd();
    }
  };

  if (isEditing) {
    return (
      <div className="w-full max-w-[800px] rounded-md bg-grey-100 px-[8px] py-[6px]">
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-title-1 text-grey-1000 outline-none"
          maxLength={10}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[800px] rounded-md py-[6px]">
      <h1 className="text-title-1 text-grey-1000">{teamName}</h1>
    </div>
  );
}
