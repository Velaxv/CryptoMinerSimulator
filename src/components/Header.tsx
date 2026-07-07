import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Zap, Bitcoin, Hash, DollarSign, Settings, Clock, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { resources, tick } = useGameStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <header className="h-16 bg-[#111A21] border-b border-[#263840] flex items-center justify-between px-4 lg:px-6 flex-shrink-0 animate-slide-in-right">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-[#3B82F6]/20 border border-[#3B82F6]/30">
            <Zap className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <span className="text-[#F8FAFC] font-bold text-sm tracking-wider uppercase hidden sm:block">
            CryptoMiner
          </span>
        </div>

        {/* Global Resource Monitor - Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {/* FIAT */}
          <div className="flex items-center gap-2 animate-pop-in" style={{ animationDelay: '100ms' }}>
            <DollarSign className="w-4 h-4 text-[#4ADE80]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#475569] uppercase tracking-wider">Fiat</span>
              <span className="font-mono text-sm text-[#4ADE80] font-bold">
                ${resources.fiat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* BTC */}
          <div className="flex items-center gap-2 animate-pop-in" style={{ animationDelay: '200ms' }}>
            <Bitcoin className="w-4 h-4 text-[#FB923C]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#475569] uppercase tracking-wider">BTC</span>
              <span className="font-mono text-sm text-[#FB923C] font-bold">
                {resources.crypto.BTC.toFixed(6)}
              </span>
            </div>
          </div>

          {/* Hashrate */}
          <div className="flex items-center gap-2 animate-pop-in" style={{ animationDelay: '300ms' }}>
            <Hash className="w-4 h-4 text-[#22D3EE]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#475569] uppercase tracking-wider">Hashrate</span>
              <span className="font-mono text-sm text-[#22D3EE] font-bold">
                14.2 TH/s
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Tick & Settings & Mobile Button */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-[#475569]">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono text-xs">Tick: {tick}</span>
          </div>
          <button 
            className="p-2 rounded hover:bg-[#1E293B] transition-all duration-200 text-[#94A3B8] hover:text-[#F8FAFC] hover:scale-110 active:scale-95"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 rounded hover:bg-[#1E293B] transition-all text-[#94A3B8] hover:text-[#F8FAFC]"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Resource Bar */}
      <div className="lg:hidden bg-[#111A21] border-b border-[#263840] px-4 py-2 flex items-center justify-between animate-slide-in-left">
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-[#4ADE80]" />
          <span className="font-mono text-xs text-[#4ADE80]">
            ${resources.fiat.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Bitcoin className="w-3 h-3 text-[#FB923C]" />
          <span className="font-mono text-xs text-[#FB923C]">
            {resources.crypto.BTC.toFixed(4)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Hash className="w-3 h-3 text-[#22D3EE]" />
          <span className="font-mono text-xs text-[#22D3EE]">14.2 TH/s</span>
        </div>
        <div className="flex items-center gap-1 text-[#475569]">
          <Clock className="w-3 h-3" />
          <span className="font-mono text-xs">{tick}</span>
        </div>
      </div>
    </>
  );
};