/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import * as OTPAuth from 'otpauth';
import { Copy, Check, Mail, Lock, KeyRound, Clock, Trash2, ArrowLeft } from 'lucide-react';

interface Account {
  id: string;
  email: string;
  password: string;
  secret: string;
}

function parseInput(text: string): Account[] {
  const accounts: Account[] = [];
  const blocks = text.trim().split(/\n\s*\n/);
  
  blocks.forEach((block, index) => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length >= 3) {
      accounts.push({
        id: `acc-${index}-${Date.now()}`,
        email: lines[0],
        password: lines[1],
        secret: lines[2].replace(/\s+/g, '').toUpperCase()
      });
    }
  });
  return accounts;
}

const CopyButton = ({ text, label }: { text: string, label?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl transition-colors text-sm font-medium text-gray-800 w-full sm:w-auto shrink-0"
    >
      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  );
};

const AccountCard = ({ account, progress, remainingSeconds, tick, index, onRemove }: { account: Account, progress: number, remainingSeconds: number, tick: number, index: number, onRemove: (id: string) => void }) => {
  const [totpCode, setTotpCode] = useState<string>('');
  
  useEffect(() => {
    try {
      const totp = new OTPAuth.TOTP({
        issuer: 'App',
        label: 'Account',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(account.secret),
      });
      setTotpCode(totp.generate());
    } catch (e) {
      setTotpCode('INVALID');
    }
  }, [account.secret, tick]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold tracking-wide uppercase shadow-sm">
          Account #{index}
        </span>
        <button
          onClick={() => onRemove(account.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Remove account"
          title="Remove account"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-blue-50 p-2.5 rounded-xl shrink-0">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
            <p className="text-gray-900 font-medium truncate text-base">{account.email}</p>
          </div>
        </div>
        <CopyButton text={account.email} label="Copy" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-purple-50 p-2.5 rounded-xl shrink-0">
            <Lock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Password</p>
            <p className="text-gray-900 font-mono text-sm truncate">{account.password}</p>
          </div>
        </div>
        <CopyButton text={account.password} label="Copy" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-orange-50 p-2.5 rounded-xl shrink-0">
            <KeyRound className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">2FA Code</p>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${remainingSeconds <= 5 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                <Clock className="w-3 h-3" />
                {remainingSeconds}s
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-gray-900 tracking-widest">
              {totpCode.length === 6 ? `${totpCode.slice(0,3)} ${totpCode.slice(3)}` : totpCode}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:w-auto w-full mt-2 sm:mt-0">
          <CopyButton text={totpCode !== 'INVALID' ? totpCode : ''} label="Copy Code" />
        </div>
      </div>
      
      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${remainingSeconds <= 5 ? 'bg-red-500' : 'bg-orange-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default function App() {
  const [inputText, setInputText] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [progress, setProgress] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(30);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const epoch = Math.floor(Date.now() / 1000);
      const currentSecond = epoch % 30;
      const currentProgress = (currentSecond / 30) * 100;
      setProgress(currentProgress);
      setRemainingSeconds(30 - currentSecond);
      setTick(epoch);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleParse = () => {
    const parsed = parseInput(inputText);
    setAccounts(parsed);
  };

  const handleClear = () => {
    setInputText('');
    setAccounts([]);
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900 font-sans selection:bg-blue-100 pb-12">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        
        <header className="mb-6 sm:mb-8 text-center sm:text-left pt-4 sm:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-2">Authenticator Hub</h1>
          <p className="text-gray-500 text-sm sm:text-base">Quickly copy your emails, passwords, and live 2FA codes.</p>
        </header>

        {accounts.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-8">
            <label htmlFor="credentials" className="block text-base font-semibold text-gray-900 mb-2">
              Paste your accounts
            </label>
            <p className="text-sm text-gray-500 mb-5">
              Format each account with 3 lines: Email, Password, 2FA Secret. Separate accounts with a blank line.
            </p>
            <textarea
              id="credentials"
              className="w-full h-72 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm resize-y leading-relaxed"
              placeholder={`example@gmail.com\nMyPassword123\n623n akq4 jpk2 2urm splq p32a 4xyn lciv\n\nanother@gmail.com\nPass456\n7ome hhiu l4im ifxo gu2n 2u35 azta tejk`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleParse}
                disabled={!inputText.trim()}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-xl transition-colors shadow-sm text-base sm:text-sm"
              >
                Parse Accounts
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAccounts([])}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  {accounts.length} Account{accounts.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4 hidden sm:block" />
                Clear All
              </button>
            </div>
            
            <div className="grid gap-4 sm:gap-6">
              {accounts.map((account, index) => (
                <AccountCard key={account.id} account={account} progress={progress} remainingSeconds={remainingSeconds} tick={tick} index={index + 1} onRemove={handleRemoveAccount} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
