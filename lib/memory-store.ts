// lib/store.ts
import { prisma } from "@/lib/db";

export const dbStore = {
  // Shared results
  saveSharedResult: async (data: {
    inputs: any;
    results: any;
    aiStory?: string;
  }): Promise<string> => {
    const result = await prisma.sharedResult.create({
      data: {
        inputs: data.inputs,
        results: data.results,
        aiStory: data.aiStory,
      },
    });
    return result.id;
  },

  getSharedResult: async (id: string) => {
    return prisma.sharedResult.findUnique({ where: { id } });
  },

  getAllSharedResult: async () => {
    return prisma.sharedResult.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  // Saved scenarios
  saveScenario: async (data: {
    name: string;
    inputs: any;
    results: any;
    aiStory?: string;
  }): Promise<string> => {
    const scenario = await prisma.savedScenario.create({
      data: {
        name: data.name,
        inputs: data.inputs,
        results: data.results,
        aiStory: data.aiStory,
      },
    });
    return scenario.id;
  },

  getAllScenarios: async () => {
    return prisma.savedScenario.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  deleteScenario: async (id: string) => {
    await prisma.savedScenario.delete({ where: { id } });
    return true;
  },
};
