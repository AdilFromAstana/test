import React from "react";
import { Card, Radio } from "antd";

const QuestionCard = ({
  question,
  variants,
  selectedAnswer,
  onAnswerChange,
}) => (
  <Card title={question} className="question-card" style={{ marginBottom: 20 }}>
    <Radio.Group
      value={selectedAnswer}
      onChange={(e) => onAnswerChange(e.target.value)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {variants.map((variant, i) => (
        <Radio
          key={i}
          value={variant}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            background: selectedAnswer === variant ? "#f0f5ff" : "#fff",
            cursor: "pointer",
          }}
        >
          {variant.type === "text" && (
            <span style={{ wordBreak: "break-word" }}>{variant.content}</span>
          )}

          {variant.type === "image" && (
            <img
              src={variant.data}
              alt={`Вариант ${i + 1}`}
              style={{ maxWidth: "100%", maxHeight: "150px" }}
            />
          )}

          {!variant.type && <span>Неизвестный формат</span>}
        </Radio>
      ))}
    </Radio.Group>
  </Card>
);

export default QuestionCard;
