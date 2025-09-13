// In-memory storage for shared results and scenarios
export type SharedResult = {
  id: string;
  inputs: any;
  results: any;
  aiStory?: string;
  createdAt: Date;
};

export type SavedScenario = {
  id: string;
  name: string;
  inputs: any;
  results: any;
  aiStory?: string;
  createdAt: Date;
};

// In-memory stores
const sharedResults = new Map<string, SharedResult>();
const savedScenarios = new Map<string, SavedScenario>();

export const memoryStore = {
  // Shared results functions
  saveSharedResult: (data: Omit<SharedResult, "id" | "createdAt">): string => {
    const id = Math.random().toString(36).substring(2, 15);
    const result: SharedResult = {
      ...data,
      id,
      createdAt: new Date(),
    };
    sharedResults.set(id, result);
    return id;
  },

  getSharedResult: (id: string): SharedResult | null => {
    return sharedResults.get(id) || null;
  },

  getAllSharedResult: () => {
    return sharedResults;
  },

  // Saved scenarios functions
  saveScenario: (data: Omit<SavedScenario, "id" | "createdAt">): string => {
    const id = Math.random().toString(36).substring(2, 15);
    const scenario: SavedScenario = {
      ...data,
      id,
      createdAt: new Date(),
    };
    savedScenarios.set(id, scenario);
    return id;
  },

  getAllScenarios: (): SavedScenario[] => {
    return Array.from(savedScenarios.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  },

  deleteScenario: (id: string): boolean => {
    return savedScenarios.delete(id);
  },
};
