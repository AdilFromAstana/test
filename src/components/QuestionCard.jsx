import React from "react";
import { Card, Radio } from "antd";

const QuestionCard = ({ question, variants, selectedAnswer, onAnswerChange }) => (
    <Card title={question} className="question-card">
        <Radio.Group value={selectedAnswer} onChange={(e) => onAnswerChange(e.target.value)} style={{ height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div
                style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateRows: `repeat(${variants.length}, 1fr)`,
                    gap: "10px",
                    height: "100%",
                }}
            >
                {variants.map((variant, i) => (
                    <Radio key={i} value={variant} style={{ width: "100%" }}>
                        {variant}
                    </Radio>
                ))}
            </div>
        </Radio.Group>
    </Card>
);

export default QuestionCard;
