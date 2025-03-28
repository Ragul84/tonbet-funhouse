
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info, Shield } from "lucide-react";

const RevenueInfo: React.FC = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center mb-4 space-x-2">
        <Info className="h-5 w-5 text-app-purple" />
        <h2 className="text-lg font-semibold text-white">Platform Information</h2>
      </div>
      
      <div className="space-y-4 text-sm text-gray-300">
        <div className="bg-black/30 p-4 rounded-lg">
          <h3 className="font-medium text-white mb-2 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-app-purple" />
            Revenue Model
          </h3>
          <p>
            This platform takes a 20% fee from game operations. The revenue is distributed as follows:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>10% goes to platform maintenance and development</li>
            <li>5% is allocated to the liquidity pool to ensure prize payments</li>
            <li>5% is distributed to token holders via smart contract</li>
          </ul>
        </div>
        
        <div className="bg-black/30 p-4 rounded-lg">
          <h3 className="font-medium text-white mb-2">Smart Contract Information</h3>
          <p className="mb-3">
            All game operations and prize distributions are handled by our verified TON smart contract. 
            You can view and audit the contract at the address below:
          </p>
          <div className="flex items-center space-x-2 bg-gray-800/50 p-2 rounded overflow-auto">
            <code className="text-xs text-gray-400">EQCsrYzV9dOzBGaz-XC7ZDu2_wpLQ9qZYJTIGs5P-rK-TCSZ</code>
            <Button variant="ghost" size="sm" className="shrink-0" onClick={() => window.open("https://tonscan.org/address/EQCsrYzV9dOzBGaz-XC7ZDu2_wpLQ9qZYJTIGs5P-rK-TCSZ", "_blank")}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Note: This is a demonstration app. In a production environment, all transactions would be 
          directly processed through the TON blockchain using real smart contracts.
        </p>
      </div>
    </div>
  );
};

export default RevenueInfo;
