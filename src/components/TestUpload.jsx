import React, { useState } from "react";
import { Upload, Button, message, Radio, Typography, Card, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import JSZip from "jszip";
import mammoth from "mammoth";

const { Text, Title } = Typography;

const TestUpload = ({ onUpload }) => {
  const [uploadedData, setUploadedData] = useState([]);
  const [selectedCount, setSelectedCount] = useState(10);

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        // Извлекаем текст с помощью mammoth
        const result = await mammoth.extractRawText({
          arrayBuffer: e.target.result,
        });
        const rawText = result.value;

        // Разделяем текст на блоки вопросов
        const questionBlocks = rawText
          .split("<question>")
          .slice(1)
          .map((block) => {
            const [question, ...variants] = block.trim().split("<variant>");
            return {
              question: question.trim(),
              variants: variants
                .map((v) => v.replace(/<\/?variant>/g, "").trim())
                .filter((v) => v.length > 0), // Убираем пустые варианты
            };
          });

        // Извлекаем изображения с помощью JSZip
        const zip = await JSZip.loadAsync(e.target.result);
        const mediaFiles = zip.folder("word/media");
        const images = [];

        if (mediaFiles) {
          const filePromises = [];
          let imageIndex = 0;

          mediaFiles.forEach((relativePath, file) => {
            filePromises.push(
              file.async("base64").then((base64Data) => ({
                type: "image",
                content: relativePath,
                index: imageIndex++, // Увеличиваем индекс изображения
                data: `data:image/png;base64,${base64Data}`,
              }))
            );
          });

          const resolvedImages = await Promise.all(filePromises);
          images.push(...resolvedImages);
        }

        console.log("Extracted images: ", images);

        // Обработка вопросов с разделением на типы
        const questions = questionBlocks.map((block, questionIndex) => {
          const { question, variants } = block;
          const combinedVariants = [];

          // Если у вопроса есть текстовые варианты, добавляем только текст
          if (variants.length > 0) {
            variants.forEach((variantText) => {
              combinedVariants.push({
                type: "text",
                content: variantText,
              });
            });
          } else {
            // Если текстовых вариантов нет, добавляем изображения
            const questionImages = images.slice(0, 5); // Например, берём 5 изображений
            images.splice(0, 5); // Убираем использованные изображения
            questionImages.forEach((image) => {
              combinedVariants.push(image);
            });
          }

          return {
            question,
            variants: combinedVariants,
          };
        });

        console.log("Processed questions:", questions);
        setUploadedData(questions);
        message.success("Файл успешно загружен!");
      } catch (error) {
        console.error(error);
        message.error("Ошибка при обработке файла: " + error.message);
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
          <Button icon={<UploadOutlined />}>
            Загрузите файл с тестами (DOCX)
          </Button>
        </Upload>
      ) : (
        <>
          <Text>Общее количество вопросов: {uploadedData.length}</Text>
          <Radio.Group
            value={selectedCount}
            onChange={(e) => setSelectedCount(e.target.value)}
          >
            <Space direction="vertical" align="start">
              <Radio value={5}>5 вопросов</Radio>
              <Radio value={10}>10 вопросов</Radio>
              <Radio value={20}>20 вопросов</Radio>
              <Radio value={30}>30 вопросов</Radio>
              <Radio value={40}>40 вопросов</Radio>
              <Radio value={50}>50 вопросов</Radio>
              <Radio value={uploadedData.length}>
                Все вопросы ({uploadedData.length})
              </Radio>
            </Space>
          </Radio.Group>
          <Button
            type="primary"
            style={{ marginTop: "20px" }}
            onClick={handleStartTest}
          >
            Начать тест
          </Button>
        </>
      )}
    </Card>
  );
};

export default TestUpload;
