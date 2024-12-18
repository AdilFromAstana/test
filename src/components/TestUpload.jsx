import React, { useState } from "react";
import { Upload, Button, message, Radio, Typography, Card, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import mammoth from "mammoth";

const { Text, Title } = Typography;

const TestUpload = ({ onUpload }) => {
    const [uploadedData, setUploadedData] = useState([]);
    const [selectedCount, setSelectedCount] = useState(10);

    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
                const rawText = result.value;

                const questions = rawText.split("<question>").slice(1).map((block) => {
                    const [question, ...variants] = block.trim().split("<variant>");
                    return {
                        question: question.trim(),
                        variants: variants.map((v) => v.replace(/<\/?variant>/g, "").trim()),
                    };
                });

                setUploadedData(questions);
                message.success("Файл успешно загружен!");
            } catch (error) {
                message.error("Ошибка при обработке файла!");
            }
        };
        reader.readAsArrayBuffer(file);
        return false;
    };

    const handleStartTest = () => {
        const shuffled = [...uploadedData].sort(() => Math.random() - 0.5);
        onUpload(shuffled.slice(0, selectedCount));
    };

    return (
        <Card style={{ textAlign: "center", margin: "50px auto" }}>
            <Title level={2}>Загрузка теста</Title>
            {!uploadedData.length ? (
                <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>Загрузите файл с тестами (DOCX)</Button>
                </Upload>
            ) : (
                <>
                    <Text>Общее количество вопросов: {uploadedData.length}</Text>
                    <Radio.Group value={selectedCount} onChange={(e) => setSelectedCount(e.target.value)}>
                        <Space direction="vertical" align="start">
                            <Radio value={5}>5 вопросов</Radio>
                            <Radio value={10}>10 вопросов</Radio>
                            <Radio value={20}>20 вопросов</Radio>
                            <Radio value={30}>30 вопросов</Radio>
                            <Radio value={40}>40 вопросов</Radio>
                            <Radio value={50}>50 вопросов</Radio>
                            <Radio value={uploadedData.length}>Все вопросы ({uploadedData.length})</Radio>
                        </Space>
                    </Radio.Group>
                    <Button type="primary" style={{ marginTop: "20px" }} onClick={handleStartTest}>
                        Начать тест
                    </Button>
                </>
            )}
        </Card>
    );
};

export default TestUpload;
