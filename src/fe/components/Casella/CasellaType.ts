export enum TerrainEnum {
    TERRA = "TERRA",
    FORESTA = "FORESTA",
    ACQUA_BASSA = "ACQUA_BASSA",
    ACQUA_PROFONDA = "ACQUA_PROFONDA",
    ROCCIA = "ROCCIA",
    SABBIA = "SABBIA",
    GHIACCIO = "GHIACCIO",
    FUOCO = "FUOCO",
    LAVICO = "LAVICO",
    MAGICO = "MAGICO",
    PRATO = "PRATO",
    FANGO = "FANGO",
    NEVE = "NEVE",
  }

  export type TerrainType = Record<TerrainEnum, { difficulty: number; color: string }>;
  
  // Mappa con difficoltà e colore per ogni tipo di terreno
  export const Terrain: TerrainType = {
    [TerrainEnum.TERRA]: { difficulty: 0, color: "#A0522D" },
    [TerrainEnum.FORESTA]: { difficulty: 1, color: "#228B22" },
    [TerrainEnum.ACQUA_BASSA]: { difficulty: 0, color: "#00BFFF" },
    [TerrainEnum.ACQUA_PROFONDA]: { difficulty: 1, color: "#00008B" },
    [TerrainEnum.ROCCIA]: { difficulty: 2, color: "#808080" },
    [TerrainEnum.SABBIA]: { difficulty: 0, color: "#FFD666" },
    [TerrainEnum.GHIACCIO]: { difficulty: 2, color: "#ADD8E6" },
    [TerrainEnum.FUOCO]: { difficulty: 2, color: "#FF4500" },
    [TerrainEnum.LAVICO]: { difficulty: 3, color: "#8B0000" },
    [TerrainEnum.MAGICO]: { difficulty: 3, color: "#800080" },
    [TerrainEnum.PRATO]: { difficulty: 0, color: "#7CFC00" },
    [TerrainEnum.FANGO]: { difficulty: 1, color: "#8B4513" },
    [TerrainEnum.NEVE]: { difficulty: 0, color: "#FFFFFF" },
  };
  