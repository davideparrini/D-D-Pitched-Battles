// src/components/AddPlayerForm.tsx
import React, { useState } from 'react';
import { PlayerRole } from '../types/player';
import '../css/AddPlayerForm.css';

interface AddPlayerFormProps {
  onAdd: (name: string, role: PlayerRole) => void;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<PlayerRole>('PLAYER');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), role);
    setName('');
  };

  return (
    <form className="add-player-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome giocatore"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value as PlayerRole)}>
        <option value="PLAYER">Giocatore</option>
        <option value="MASTER">Master</option>
      </select>
      <button type="submit">Aggiungi</button>
    </form>
  );
};

export default AddPlayerForm;
