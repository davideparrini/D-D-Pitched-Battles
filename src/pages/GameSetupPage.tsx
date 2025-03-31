// src/pages/GameSetupPage.tsx
import React, { useState } from 'react';
import { LabeledCell } from '../types/map';
import { TokenType, CharacterStats, defaultStats } from '../types/token';
import { v4 as uuidv4 } from 'uuid';
import { Player, PlayerRole } from '../types/player';
import GridOverlay from '../components/GridOverlay';
import Token from '../components/Token';
import AddPlayerForm from '../components/AddPlayerForm';
import '../css/GameSetupPage.css';

interface LoadedMapData {
  name: string;
  image: string;
  cellSize: number;
  offsetX: number;
  offsetY: number;
  labeledCells: LabeledCell[];
  tokens: TokenType[];
}

const GameSetupPage: React.FC = () => {
  const [mapData, setMapData] = useState<LoadedMapData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedTokenAssignments, setSelectedTokenAssignments] = useState<Record<string, string>>({});
  const [tokensStats, setTokensStats] = useState<Record<string, CharacterStats>>({});
  const [initiativeDetails, setInitiativeDetails] = useState<
    { tokenId: string; roll: number; bonus: number; total: number }[]
  >([]);
  const [selectingTokenId, setSelectingTokenId] = useState<string | null>(null);

  const handleMapImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const json = JSON.parse(reader.result as string);
      setMapData(json);
      const tokenStats: Record<string, CharacterStats> = {};
      json.tokens.forEach((token: TokenType) => {
        tokenStats[token.id] = token.stats ?? { ...defaultStats };
      });
      setTokensStats(tokenStats);
    };
    reader.readAsText(file);
  };

  const handleAddPlayer = (name: string, role: PlayerRole) => {
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      role,
      tokenIds: [],
    };
    setPlayers((prev) => [...prev, newPlayer]);
  };

  const assignTokenToPlayer = (tokenId: string, playerId: string) => {
    setSelectedTokenAssignments((prev) => ({
      ...prev,
      [tokenId]: playerId,
    }));
    setSelectingTokenId(null);
  };

  const handleStatChange = (tokenId: string, stat: keyof CharacterStats, value: number) => {
    setTokensStats((prev) => ({
      ...prev,
      [tokenId]: { ...prev[tokenId], [stat]: value },
    }));
  };

  const rollInitiative = () => {
    if (!mapData) return;

    const rolls = mapData.tokens.map((token) => {
      const stats = tokensStats[token.id] ?? defaultStats;
      const bonus = Math.floor((stats.destrezza - 10) / 2);
      const roll = Math.floor(Math.random() * 20 + 1);
      const total = roll + bonus;
      return { tokenId: token.id, roll, bonus, total };
    });

    rolls.sort((a, b) => b.total - a.total);
    setInitiativeDetails(rolls);
  };

  const getTokenLabels = (tokens: TokenType[]): Record<string, string> => {
    const counts: Record<string, number> = {};
    const labels: Record<string, string> = {};

    for (const token of tokens) {
      const base = token.type;
      counts[base] = (counts[base] || 0) + 1;
      labels[token.id] = counts[base] > 1 ? `${base} #${counts[base]}` : base;
    }

    return labels;
  };

  return (
    <div className="game-setup-page">
      <h1>Setup partita</h1>

      <input type="file" accept=".json" onChange={handleMapImport} />

      {mapData && (
        <>
          <h2>{mapData.name}</h2>

          <div className="config-panel">
            <h3>Giocatori</h3>
            <AddPlayerForm onAdd={handleAddPlayer} />

            <ul>
              {players.map((p) => (
                <li key={p.id}>
                  {p.name} ({p.role})
                </li>
              ))}
            </ul>

            {selectingTokenId && (
              <div style={{ marginTop: '1rem' }}>
                <h4>Assegna token selezionato:</h4>
                <select
                  value={selectedTokenAssignments[selectingTokenId] || ''}
                  onChange={(e) => assignTokenToPlayer(selectingTokenId, e.target.value)}
                >
                  <option value="">-- Seleziona giocatore --</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mappa-container">
            <GridOverlay
              imageSrc={mapData.image}
              cellSize={mapData.cellSize}
              offsetX={mapData.offsetX}
              offsetY={mapData.offsetY}
              labeledCells={mapData.labeledCells}
              showDifficulty={false}
              darkMode={false}
              isMouseDown={false}
            />

            {mapData.tokens.map((token) => {
              const label = getTokenLabels(mapData.tokens)[token.id];
              const playerId = selectedTokenAssignments[token.id];
              const player = players.find((p) => p.id === playerId);

              return (
                <Token
                  key={token.id}
                  x={token.x}
                  y={token.y}
                  type={token.type}
                  cellSize={mapData.cellSize}
                  label={label}
                  playerName={player?.name}
                  onClick={() => setSelectingTokenId(token.id)}
                />
              );
            })}
          </div>

          <h3>Assegna Statistiche</h3>
          {mapData.tokens.map((token) => (
            <div key={token.id} className="token-assign-block">
              <strong>{getTokenLabels(mapData.tokens)[token.id]}</strong>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                {Object.keys(defaultStats).map((stat) => (
                  <label key={stat}>
                    {stat}:{' '}
                    <input
                      type="number"
                      value={tokensStats[token.id]?.[stat as keyof CharacterStats] ?? 10}
                      onChange={(e) =>
                        handleStatChange(token.id, stat as keyof CharacterStats, parseInt(e.target.value, 10))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button onClick={rollInitiative}>Tira iniziativa</button>

          {initiativeDetails.length > 0 && (
            <div>
              <h3>Ordine di Iniziativa</h3>
              <ol>
                {initiativeDetails.map(({ tokenId, roll, bonus, total }) => {
                  const playerId = selectedTokenAssignments[tokenId];
                  const player = players.find((p) => p.id === playerId);
                  return (
                    <li key={tokenId}>
                      <strong>{getTokenLabels(mapData.tokens)[tokenId]}</strong>{' '}
                      {player ? `(${player.name})` : ''} — 🎲 {roll} + {bonus >= 0 ? `${bonus}` : bonus} ={' '}
                      <strong>{total}</strong>
                    </li>
                  );
                })}
              </ol>

              <button onClick={() => alert('Vai alla pagina di gioco!')}>Avvia partita</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameSetupPage;
