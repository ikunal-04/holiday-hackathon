import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { useChallengeStore } from '../store/useChallengeStore';
import { formatEther } from 'ethers';
import { Trophy } from 'lucide-react';

export const ChallengeList: React.FC = () => {
  const { challenges, loading, fetchChallenges } = useChallengeStore();

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className="bg-yellow-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:scale-105"
        >
          <div className="bg-purple-500 p-4 text-white">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              {challenge.title}
            </h3>
            <span className="text-yellow-200">{challenge.category}</span>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-800">Staking Amount:</span>
              <span className="font-bold">{formatEther(challenge.stakingAmount)} ETH</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Start Date:</span>
              <span>{format(challenge.startTime * 1000, 'PPP')}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">End Date:</span>
              <span>{format(challenge.endTime * 1000, 'PPP')}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Participants:</span>
              <span>{challenge.participantCount}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                challenge.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {challenge.isActive ? 'Active' : 'Completed'}
              </span>
            </div>
          </div>
          
          <div className="p-4 bg-gray-100 border-t">
            <button className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
              Join Challenge
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};