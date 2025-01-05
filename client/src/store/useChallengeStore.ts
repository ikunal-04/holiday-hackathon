import { create } from 'zustand';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/contract';
import { useWalletStore } from './useWalletStore';

interface Challenge {
  id: number;
  creator: string;
  title: string;
  category: string;
  stakingAmount: bigint;
  startTime: number;
  endTime: number;
  gracePeriodHours: number;
  isActive: boolean;
  participantCount: number;
}

interface ChallengeState {
  challenges: Challenge[];
  loading: boolean;
  fetchChallenges: () => Promise<void>;
  createChallenge: (params: {
    title: string;
    category: string;
    stakingAmount: string;
    durationInDays: number;
    gracePeriodHours: number;
  }) => Promise<void>;
  uploadDailyPost: (challengeId: number, ipfsHash: string) => Promise<void>;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: [],
  loading: false,

  fetchChallenges: async () => {
    try {
      set({ loading: true });
      const { provider } = useWalletStore.getState();
      
      if (!provider) throw new Error('Wallet not connected');

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const challengeCount = await contract.challengeCount();
      
      const challenges: Challenge[] = [];
      for (let i = 1; i <= challengeCount; i++) {
        const challenge = await contract.getChallengeDetails(i);
        challenges.push({
          id: i,
          creator: challenge.creator,
          title: challenge.title,
          category: challenge.category,
          stakingAmount: challenge.stakingAmount,
          startTime: Number(challenge.startTime),
          endTime: Number(challenge.endTime),
          gracePeriodHours: Number(challenge.gracePeriodHours),
          isActive: challenge.isActive,
          participantCount: Number(challenge.participantCount),
        });
      }

      set({ challenges });
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createChallenge: async (params) => {
    try {
      set({ loading: true });
      const { signer } = useWalletStore.getState();
      
      if (!signer) throw new Error('Wallet not connected');

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.createChallenge(
        params.title,
        params.category,
        ethers.parseEther(params.stakingAmount),
        params.durationInDays,
        params.gracePeriodHours,
        { value: ethers.parseEther(params.stakingAmount) }
      );

      await tx.wait();
      await get().fetchChallenges();
    } catch (error) {
      console.error('Failed to create challenge:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  uploadDailyPost: async (challengeId: number, ipfsHash: string) => {
    try {
      set({ loading: true });
      const { signer } = useWalletStore.getState();
      
      if (!signer) throw new Error('Wallet not connected');

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.uploadDailyPost(challengeId, ipfsHash);
      await tx.wait();
    } catch (error) {
      console.error('Failed to upload daily post:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));