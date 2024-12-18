import React from "react";
import { Layout, Typography, Menu } from "antd";
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { TestProvider } from "./components/TestContext";
import TestUpload from "./components/TestUpload";
import TestRunner from "./components/TestRunner";
import TestHistory from "./components/TestHistory";
import TestDetails from "./components/TestDetails";
import DrawerMenu from "./components/DrawerMenu"; // Импорт нового компонента DrawerMenu
import { useTestContext } from "./components/TestContext";

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  return (
    <TestProvider>
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ background: "#001529", position: "sticky", top: 0, zIndex: 1000 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: '100%' }}>
              <Link to="/">
                <Title level={3} style={{ color: "white", margin: 0 }}>
                  Әділ Тест
                </Title>
              </Link>
              {isMobile ? <DrawerMenu /> : <DesktopMenu />}
            </div>
          </Header>

          <Content style={{ padding: "20px 0px" }}>
            <Switch>
              <Route exact path="/" component={TestUploadPage} />
              <Route path="/test/:testId" component={TestPage} />
              <Route exact path="/history" component={TestHistory} />
              <Route path="/history/:testId" component={TestDetails} />
            </Switch>
          </Content>
        </Layout>
      </Router>
    </TestProvider>
  );
};

const DesktopMenu = () => (
  <Menu theme="dark" mode="horizontal" selectable={false}>
    <Menu.Item key="1">
      <Link to="/">Главная</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to="/history">История тестов</Link>
    </Menu.Item>
  </Menu>
);

const TestUploadPage = () => {
  const history = useHistory();
  const { setCurrentTestId, setCurrentTestData } = useTestContext(); // Контекст для хранения ID и данных теста

  const handleTestStart = (data) => {
    const testId = Date.now().toString(); // Генерация уникального ID
    setCurrentTestId(testId); // Устанавливаем текущий ID в контекст
    setCurrentTestData(data); // Сохраняем данные теста в контексте
    history.push(`/test/${testId}`); // Переходим на страницу прохождения теста
  };

  return <TestUpload onUpload={handleTestStart} />;
};


const TestPage = () => {
  const { currentTestData, clearTest } = useTestContext();

  if (!currentTestData) {
    return <div>Тест не найден. Вернитесь на главную страницу.</div>;
  }

  return (
    <TestRunner
      testData={currentTestData}
      onFinish={() => {
        clearTest(); // Очистка данных текущего теста из контекста
      }}
    />
  );
};


export default App;
