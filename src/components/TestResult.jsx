import React from "react";
import { Card, Progress, Typography, Button } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const TestResult = ({ questions, answers, correctCount }) => {
    const totalQuestions = questions.length;

    // Подсчёт процента и оценки
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const pointsPerQuestion = (100 / totalQuestions).toFixed(2);
    const totalScore = (correctCount * pointsPerQuestion).toFixed(2);

    // Определение цвета прогресса
    const getColor = () => {
        if (percentage < 50) return "red";
        if (percentage <= 70) return "blue";
        return "green";
    };

    return (
        <Card style={{ textAlign: "center" }}>
            <Title level={2}>Результаты теста</Title>

            {/* Круглый прогресс-бар */}
            <Progress
                type="circle"
                percent={percentage}
                strokeColor={getColor()}
                format={(percent) => `${percent}%`}
                style={{ marginBottom: "20px" }}
            />

            {/* Баллы и результаты */}
            <Text style={{ fontSize: "18px", color: getColor(), fontWeight: "bold" }}>
                {`Вы ответили правильно на ${correctCount} из ${totalQuestions} вопросов (${percentage}%)`}
            </Text>
            <br />
            <Text style={{ fontSize: "18px", color: getColor() }}>
                {`Общая оценка: ${totalScore}`}
            </Text>

            {/* Список всех вопросов с результатами */}
            <div style={{ marginTop: "20px" }}>
                {questions.map((q, index) => {
                    const isCorrect = answers[index] === q.correctAnswer;

                    return (
                        <Card
                            key={index}
                            size="small"
                            title={`Вопрос ${index + 1}`}
                            style={{
                                marginBottom: "10px",
                                borderColor: isCorrect ? "green" : "red",
                            }}
                        >
                            <p style={{ fontWeight: "bold" }}>{q.question}</p>
                            <ul style={{ textAlign: "left", paddingLeft: "20px", margin: 0 }}>
                                {q.variants.map((variant, i) => {
                                    const isUserChoice = answers[index] === variant;
                                    const isCorrectChoice = variant === q.correctAnswer;

                                    return (
                                        <li
                                            key={i}
                                            style={{
                                                color: isCorrectChoice ? "green" : isUserChoice ? "red" : "black",
                                                fontWeight: isUserChoice ? "bold" : "normal",
                                                listStyleType: "disc",
                                                marginBottom: "5px",
                                            }}
                                        >
                                            {variant} {isCorrectChoice ? "(Правильный ответ)" : ""}
                                            {isUserChoice && !isCorrectChoice ? " (Ваш выбор)" : ""}
                                        </li>
                                    );
                                })}
                            </ul>
                        </Card>
                    );
                })}
            </div>

            {/* Кнопки навигации */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
                <Link to="/">
                    <Button type="primary" >
                        Загрузить новый тест
                    </Button>
                </Link>
                <Link to="/">
                    <Button >На главную</Button>
                </Link>
            </div>
        </Card>
    );
};

export default TestResult;
