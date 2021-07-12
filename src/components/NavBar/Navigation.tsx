import React, {FC, useEffect} from 'react';
import {Menu} from "antd";
import {AppstoreAddOutlined, FundViewOutlined} from "@ant-design/icons";
import {NavLink, useLocation} from "react-router-dom";

type PropsType = {}
const Navigation: FC<PropsType> = React.memo((props) => {
    let location = useLocation();
    let selectedKey = location.pathname.toLowerCase().split('/')[1];
    useEffect(() => {
        selectedKey = location.pathname.toLowerCase().split('/')[1];
    }, [location])

    return (
        <Menu
            selectedKeys={[selectedKey]}
            mode={'vertical'}
            theme={'dark'}
        >
            <Menu.Item key="create" icon={<AppstoreAddOutlined/>}>
                <NavLink to={`/create`}>Create token</NavLink>
            </Menu.Item>
            <Menu.Item key="view" icon={<FundViewOutlined/>}>
                <NavLink to={`/view`}>All your tokens</NavLink>
            </Menu.Item>
        </Menu>

    );
});

export default Navigation;