import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import QuestionSelect from "./QuestionSelect";
import QuestionCard from "./QuestionCard";
import NavigationButtons from "./NavigationButtons";
import TestResult from "./TestResult";
import { useTestContext } from "./TestContext"; // Импорт контекста

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const TestRunner = ({ testData }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { currentTestId } = useTestContext(); // Получаем текущий ID из контекста

    useEffect(() => {
        if (testData.length > 0) {
            const shuffledQuestions = shuffleArray(testData).slice(0, 20);
            const randomizedQuestions = shuffledQuestions.map((q) => {
                const correctAnswer = q.variants[0];
                return {
                    ...q,
                    variants: shuffleArray([correctAnswer, ...q.variants.slice(1)]),
                    correctAnswer,
                };
            });
            setQuestions(randomizedQuestions);
        }
    }, [testData]);

    const handleAnswerChange = (value) => setAnswers({ ...answers, [currentQuestion]: value });

    const saveResultsToLocalStorage = () => {
        const testResult = {
            date: new Date().toLocaleString(),
            questions,
            answers,
            id: currentTestId,
            correctCount: Object.keys(answers).filter(
                (key) => answers[key] === questions[key]?.correctAnswer
            ).length,
            totalQuestions: questions.length,
        };

        const previousResults = JSON.parse(localStorage.getItem("testResults")) || [];
        localStorage.setItem("testResults", JSON.stringify([...previousResults, testResult]));
    };

    const handleSubmit = () => {
        saveResultsToLocalStorage();
        setSubmitted(true);
    };

    const correctCount = Object.keys(answers).filter(
        (key) => answers[key] === questions[key]?.correctAnswer
    ).length;

    const showModal = () => setIsModalVisible(true);
    const handleModalOk = () => {
        setIsModalVisible(false);
        handleSubmit();
    };
    const handleModalCancel = () => setIsModalVisible(false);

    if (questions.length === 0) return <div>Загрузка вопросов...</div>;

    return (
        <div className="test-container">
            {!submitted ? (
                <>
                    <QuestionSelect
                        questions={questions}
                        currentQuestion={currentQuestion}
                        onChange={setCurrentQuestion}
                    />
                    <QuestionCard
                        question={questions[currentQuestion].question}
                        variants={questions[currentQuestion].variants}
                        selectedAnswer={answers[currentQuestion]}
                        onAnswerChange={handleAnswerChange}
                    />
                    <NavigationButtons
                        currentQuestion={currentQuestion}
                        totalQuestions={questions.length}
                        onPrev={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
                        onNext={() => setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1))}
                        onSubmit={handleSubmit}
                        allAnswered={questions.every((_, index) => answers[index] !== undefined)}
                        onFinishEarly={showModal}
                    />
                    {/* Модальное окно подтверждения */}
                    <Modal
                        title="Подтвердите завершение теста"
                        open={isModalVisible}
                        onOk={handleModalOk}
                        onCancel={handleModalCancel}
                        okText="Да, завершить"
                        cancelText="Отмена"
                    >
                        <p>Вы уверены, что хотите завершить тест досрочно?</p>
                        <p>Ваши текущие ответы будут сохранены.</p>
                    </Modal>
                </>
            ) : (
                <TestResult
                    questions={questions}
                    answers={answers}
                    correctCount={correctCount}
                />
            )}
        </div>
    );
};

export default TestRunner;
