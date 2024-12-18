import React, { createContext, useState, useContext } from "react";

// Создание контекста
const TestContext = createContext();

// Хук для доступа к контексту
export const useTestContext = () => useContext(TestContext);

// Провайдер контекста
export const TestProvider = ({ children }) => {
    const [currentTestId, setCurrentTestId] = useState(null);
    const [currentTestData, setCurrentTestData] = useState(null);

    // Очистка текущего теста
    const clearTest = () => {
        setCurrentTestId(null);
        setCurrentTestData(null);
    };

    return (
        <TestContext.Provider
            value={{
                currentTestId,
                setCurrentTestId,
                currentTestData,
                setCurrentTestData,
                clearTest,
            }}
        >
            {children}
        </TestContext.Provider>
    );
};
