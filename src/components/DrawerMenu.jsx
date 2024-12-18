import React, { useState } from "react";
import { Menu, Button, Drawer } from "antd";
import { Link } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";

const DrawerMenu = () => {
    const [visible, setVisible] = useState(false); // Состояние для отображения Drawer

    const showDrawer = () => setVisible(true);
    const closeDrawer = () => setVisible(false);

    return (
        <>
            {/* Кнопка для открытия Drawer */}
            <Button type="text" icon={<MenuOutlined />} onClick={showDrawer} style={{ color: "white" }} />

            {/* Drawer с элементами меню */}
            <Drawer
                title="Меню"
                placement="left"
                onClose={closeDrawer}
                visible={visible}
                bodyStyle={{ padding: 0 }}
            >
                <Menu mode="vertical" selectable={false} onClick={closeDrawer}>
                    <Menu.Item key="1">
                        <Link to="/">Главная</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/history">История тестов</Link>
                    </Menu.Item>
                </Menu>
            </Drawer>
        </>
    );
};

export default DrawerMenu;
