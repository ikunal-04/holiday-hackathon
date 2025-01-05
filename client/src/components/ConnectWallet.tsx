import React from 'react';
import { Wallet } from 'lucide-react';
import { useWalletStore } from '../store/useWalletStore';
import { formatAddress } from '../utils/format';

export const ConnectWallet: React.FC = () => {
  const { address, connect, disconnect, isConnecting } = useWalletStore();

  const handleClick = async () => {
    if (address) {
      disconnect();
    } else {
      try {
        await connect();
      } catch {
        // Error is handled in the store with toast
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
    >
      <Wallet className="w-5 h-5" />
      {isConnecting ? (
        'Connecting...'
      ) : address ? (
        formatAddress(address)
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
};