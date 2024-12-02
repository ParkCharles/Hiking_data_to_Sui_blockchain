import React, { createContext, useContext, useState, ReactNode } from "react";

interface WalletAddressContextType {
    walletAddress: string,
    setWalletAddress: React.Dispatch<React.SetStateAction<string>>;
}

const WalletAddressContext = createContext<WalletAddressContextType | undefined>(undefined);

export const useWalletAddress = (): WalletAddressContextType => {
    const context = useContext(WalletAddressContext);
    if (!context) {
        throw new Error('useWalletAddress must be used within a WalletAddressProvider');
    }
    return context;
};

interface WalletAddressProviderProps {
    children: ReactNode;
}

export const WalletAddressProvider: React.FC<WalletAddressProviderProps> = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState<string>('');

    return (
        <WalletAddressContext.Provider value={{ walletAddress, setWalletAddress}}>
            {children}
        </WalletAddressContext.Provider>
    );
};