import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

const currencyOptions = [
  { country: 'USA', code: 'USD', symbol: '$', rate: 1 },
  { country: 'Canada', code: 'CAD', symbol: 'CA$', rate: 1.35 },
  { country: 'India', code: 'INR', symbol: '₹', rate: 83 },
];

export const CurrencyProvider = ({ children }) => {
  // Default to USD
  const [currency, setCurrency] = useState(currencyOptions[0]);

  const changeCurrency = (code) => {
    const found = currencyOptions.find((c) => c.code === code);
    if (found) setCurrency(found);
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, currencyOptions }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
