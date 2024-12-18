import React from "react";
import { Select } from "antd";

const { Option } = Select;

const QuestionSelect = ({ questions, currentQuestion, onChange }) => (
    <div className="question-select">
        <label style={{ marginRight: "10px" }}>Перейти к вопросу:</label>
        <Select value={currentQuestion} style={{ width: 120 }} onChange={onChange}>
            {questions.map((_, index) => (
                <Option key={index} value={index}>
                    Вопрос {index + 1}
                </Option>
            ))}
        </Select>
    </div>
);

export default QuestionSelect;
