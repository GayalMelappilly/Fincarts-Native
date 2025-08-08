import React, { createContext, useContext, useState, ReactNode } from 'react';

type FooterElementContextType = {
    activeElement: string;
    setActiveElement: (activeElement: string) => void;
};

const FooterElementContext = createContext<FooterElementContextType | undefined>(undefined);

export const FooterElementProvider = ({ children }: { children: ReactNode }) => {

    const [activeElement, setActiveElement] = useState<string>("dashboard")

    return (
        <FooterElementContext.Provider value={{ activeElement, setActiveElement }}>
            {children}
        </FooterElementContext.Provider>
    );
};

export const useFooterElement = () => {
    const context = useContext(FooterElementContext);
    if (!context) throw new Error('useFooterElement must be used within an FooterElementProvider');
    return context;
};
