'use client'

import { truncateSync } from 'fs';
import { createContext, ReactNode, useState } from 'react';

interface UIState {
    selectedProjectId: string | null;
    setSelectedProjectId: (value: string | null) => void;
}

export const DashboardUIContext = createContext<UIState>({
    selectedProjectId: null,
    setSelectedProjectId: () => {},
});

export const DashboardUIContextProvider = ({ children }: { children: ReactNode }) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    return (
        <DashboardUIContext.Provider
            value={{
                selectedProjectId,
                setSelectedProjectId,
            }}
        >
            {children}
        </DashboardUIContext.Provider>
    );
};