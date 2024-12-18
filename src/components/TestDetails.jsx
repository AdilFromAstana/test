import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { Card, Typography, List, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const TestDetails = () => {
    const { testId } = useParams();
    const history = useHistory();

    const savedResults = JSON.parse(localStorage.getItem("testResults")) || [];
    const test = savedResults.find((result) => result.id === testId);

    if (!test) {
        return <Title level={3}>Тест не найден!</Title>;
    }

    return (
        <Card style={{ margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <Button
                    type="link"
                    icon={<LeftOutlined />}
                    onClick={() => history.push("/history")}
                    style={{ fontSize: "18px" }}
                />
                <Title level={2} style={{ margin: "0 0 0 10px" }}>Детальный отчёт по тесту</Title>
            </div>

            <Text>Дата прохождения: {test.date}</Text>
            <br />
            <Text>
                Правильных ответов: {test.correctCount} из {test.totalQuestions} (
                {Math.round((test.correctCount / test.totalQuestions) * 100)}%)
            </Text>

            <List
                bordered
                dataSource={test.questions}
                renderItem={(question, index) => {
                    const userAnswer = test.answers[index];
                    const isCorrect = userAnswer === question.correctAnswer;

                    return (
                        <List.Item>
                            <div>
                                <Text strong>Вопрос {index + 1}:</Text>
                                <p>{question.question}</p>
                                <ul>
                                    {question.variants.map((variant, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                color: variant === question.correctAnswer ? "green" : userAnswer === variant ? "red" : "black",
                                                fontWeight: userAnswer === variant ? "bold" : "normal",
                                            }}
                                        >
                                            {variant}
                                            {variant === question.correctAnswer ? " (Правильный ответ)" : ""}
                                            {variant === userAnswer && variant !== question.correctAnswer ? " (Ваш ответ)" : ""}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </List.Item>
                    );
                }}
            />
        </Card>
    );
};

export default TestDetails;
