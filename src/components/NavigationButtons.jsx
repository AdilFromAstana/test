import React from "react";
import { Button } from "antd";

const NavigationButtons = ({
    currentQuestion,
    totalQuestions,
    onPrev,
    onNext,
    onSubmit,
    allAnswered,
    onFinishEarly,
}) => (
    <div className="navigation-buttons" style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <Button onClick={onPrev} disabled={currentQuestion === 0}>
            Назад
        </Button>

        <div style={{ display: "flex", gap: "10px" }}>
            <Button type="default" danger onClick={onFinishEarly}>
                Завершить досрочно
            </Button>
            {currentQuestion === totalQuestions - 1 ? (
                <Button type="primary" onClick={onSubmit} disabled={!allAnswered}>
                    Завершить тест
                </Button>
            ) : (
                <Button type="primary" onClick={onNext}>
                    Далее
                </Button>
            )}
        </div>
    </div>
);

export default NavigationButtons;
