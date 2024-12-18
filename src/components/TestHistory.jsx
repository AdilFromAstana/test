import React, { useState, useEffect } from "react";
import { Card, List, Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const TestHistory = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const savedResults = JSON.parse(localStorage.getItem("testResults")) || [];
        setResults(savedResults);
    }, []);

    const clearHistory = () => {
        localStorage.removeItem("testResults");
        setResults([]);
    };

    return (
        <Card style={{ margin: "0 auto", textAlign: "center" }}>
            <Title level={2}>История тестов</Title>
            {results.length > 0 ? (
                <>
                    <List
                        bordered
                        dataSource={results}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Link to={`/history/${item.id}`}>
                                        <Button type="link">Посмотреть детали</Button>
                                    </Link>,
                                ]}
                            >
                                <div style={{ textAlign: "left" }}>
                                    <Text strong>{`Тест (${item.date})`}</Text>
                                    <br />
                                    <Text>
                                        Правильных ответов: {item.correctCount} из {item.totalQuestions} (
                                        {Math.round((item.correctCount / item.totalQuestions) * 100)}%)
                                    </Text>
                                </div>
                            </List.Item>
                        )}
                    />
                    <Button type="danger" style={{ marginTop: "10px" }} onClick={clearHistory}>
                        Очистить историю
                    </Button>
                </>
            ) : (
                <Text>История тестов пуста.</Text>
            )}
        </Card>
    );
};

export default TestHistory;
