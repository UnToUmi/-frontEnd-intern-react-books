
import React, { useState } from "react";
import {
    AppstoreAddOutlined,
    ExceptionOutlined,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, message, Avatar } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './layout.scss';
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutAction } from "../../redux/account/accountSlice";
import { callLogout } from "../../services/api";
import ModalManageAccount from "./mangeAccount";
import { useEffect } from "react";

const { Content, Footer, Sider } = Layout;

const items = [
    {
        label: <Link to='/admin'>Dashboard</Link>,
        key: 'dashboard',
        icon: <AppstoreAddOutlined />
    },
    {
        label: <span>Manage Users</span>,
        icon: <UserOutlined />,
        children: [{
            label: <Link to='/admin/user'>CRUD</Link>,
            key: 'crud',
            icon: <TeamOutlined />,
        },
        {
            label: 'files1',
            key: 'file1',
            icon: <TeamOutlined />,
        }
        ]
    },
    {
        label: <Link to='/admin/book'>Manage Books</Link>,
        key: 'book',
        icon: <ExceptionOutlined />
    },
    {
        label: <Link to='/admin/order'>Manage Orders</Link>,
        key: 'order',
        icon: <DollarCircleOutlined />
    },
];

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const user = useSelector(state => state.account.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);


    const handleLogout = async (event) => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(handleLogoutAction());
            message.success('Logout success!');
            navigate('/');
        }

    }
    const handleBackHome = () => {
        navigate('/');
    }

    const itemsDropdown = [
        {
            label: <div onClick={(event => handleBackHome(event))}>Back to home page</div>,
            key: 'home',
        },
        {
            label: <div onClick={() => setOpenModal(true)}>Manage account</div>,
            key: 'account',
        },

        {
            label: <div onClick={(event) => handleLogout(event)}>Logout</div>,
            key: 'logout,'
        },


    ];

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    useEffect(() => {
        items.map((item, index) => {
            if (window.location.pathname.includes(`/${item.key}`)) {
                setActiveMenu(`${item.key}`)
            }
            if (window.location.pathname.includes(`/user`)) {
                setActiveMenu(`crud`);
            }
        })
    }, [])
    return (
        <>
            <ModalManageAccount
                openModal={openModal}
                setOpenModal={setOpenModal}
            />
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                <Sider
                    theme="light"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div
                        style={{ height: 32, margin: 16, textAlign: 'center' }}
                    >
                        Admin
                    </div>
                    <Menu
                        // defaultSelectedKeys={[activeMenu]}
                        selectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                    >
                    </Menu>
                </Sider>
                <Layout>
                    <div className="admin-header">
                        <span>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed)
                            })}
                        </span>
                        <Dropdown
                            menu={{ items: itemsDropdown }}
                            trigger={['click']}
                        >
                            <a
                                onClick={(e) => e.preventDefault()}
                            >
                                <Space>
                                    <Avatar src={urlAvatar} />
                                    {user?.fullName}
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                    <Content>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};
export default LayoutAdmin;