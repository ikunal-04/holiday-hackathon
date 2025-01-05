import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ConnectWallet } from './components/ConnectWallet';
import { CreateChallenge } from './components/CreateChallenge';
import { ChallengeList } from './components/ChallengeList';
import { Trophy } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Trophy className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Resolution DApp</h1>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Active Challenges</h2>
          <CreateChallenge />
        </div>
        
        <ChallengeList />
      </main>
    </div>
  );
}

export default App;