import React, { useState } from "react";
import { FiShoppingCart } from 'react-icons/fi';
import { FaReact } from 'react-icons/fa';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, message, Avatar, Popover } from "antd";
import './header.scss';
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined } from "@ant-design/icons/lib/icons";
import { Dropdown, Space } from 'antd';
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { callLogout } from "../../services/api";
import { handleLogoutAction } from "../../redux/account/accountSlice";
import ModalManageAccount from "./modalManageAccount";

const Header = (props) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuth = useSelector(state => state.account.isAuth);
    const user = useSelector(state => state.account.user);
    const [openModal, setOpenModal] = useState(false);
    // const [searchTerm, setSearchTerm] = useOutletContext();
    const searchTerm = props.searchTerm;
    const setSearchTerm = props.setSearchTerm;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const carts = useSelector(state => state.order.carts)

    const handleLogout = async (event) => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(handleLogoutAction());
            message.success('Logout success!');
            navigate('/');
        }

    }
    const handleHomeIcon = () => {
        navigate("/")
    }

    const handleViewCart = () => {
        navigate("/order")
    }
    const handleHistory = () => {
        navigate("/history")
    }
    const handleSearchTerm = (event) => {
        setTimeout(() => {
            setSearchTerm(event.target.value)
        }, 400)

    }
    let items = [
        {
            label: <div
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenModal(true)}
            >Manage account</div>,
            key: 'account'
        },
        {
            label: <div
                style={{ cursor: 'pointer' }}
                onClick={() => handleHistory()}
            >Purchase history</div>,
            key: 'history'
        },
        {
            label:
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={(event) => handleLogout(event)}>Logout
                </div>,
            key: 'logout'
        }
    ];
    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to="/admin">Manager page</Link>,
            key: "admin"
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const contentPopover = () => {
        return (
            <div className="pop-cart-body">
                <div className="pop-cart-content">
                    {carts?.map((book, index) => {
                        return (
                            <div
                                className="book"
                                key={`book-${index}`}
                            >
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                                <div>{book?.detail?.mainText}</div>
                                <div className="price">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="pop-cart-footer">
                    <button
                        className="view-cart"
                        onClick={() => handleViewCart()}
                    >View cart</button>
                </div>
            </div>

        )
    }
    return (
        <>
            <ModalManageAccount
                openModal={openModal}
                setOpenModal={setOpenModal}
            />
            <div className="header-container">
                <header className="page-header">
                    <div className="page-header_top">
                        <div className="page-header_toggle"
                            onClick={() => {
                                setOpenDrawer(true)
                            }}
                        >
                            <span className="logo-small">
                                <FaReact className="rotate icon-react" />
                            </span>
                        </div>
                        <div className="page-header_logo">
                            <span className="logo">
                                <FaReact
                                    className="rotate icon-react"
                                    onClick={() => handleHomeIcon()}
                                /> Yahallo
                                <VscSearchFuzzy className="icon-search" />
                            </span>
                            <input
                                className="input-search"
                                type={'text'}
                                onChange={(event) => handleSearchTerm(event)}
                                placeholder="What do you want to find today?"
                            >
                            </input>
                        </div>
                    </div>
                    <nav
                        className="page-header_bottom"
                    >
                        <ul id="navigation" className="navigation">
                            <li
                                className="navigation_item"
                            >
                                <Popover
                                    className="popover-carts"
                                    placement="topRight"
                                    rootClassName="popover-carts"
                                    title={"List of book ordered"}
                                    content={contentPopover}
                                    arrow={true}
                                >

                                    <Badge
                                        count={carts?.length ?? 0}
                                        size={"small"}
                                        showZero
                                    >
                                        <FiShoppingCart className="icon-cart" />
                                    </Badge>
                                </Popover>
                            </li>
                            {/* <li className="navigation_item mobile"><Divider type="vertical" /></li> */}
                            <li

                                className="navigation_item mobile"
                            >
                                {!isAuth ?
                                    <span
                                        style={{ marginLeft: 10 }}
                                        onClick={() => navigate('/login')}>Your Account</span>
                                    :
                                    <Dropdown

                                        menu={{ items }}
                                        trigger={['click']}
                                    >
                                        <Space
                                            style={{
                                                marginLeft: 10,
                                                position: "relative"

                                            }}
                                        >
                                            <Avatar
                                                src={urlAvatar}
                                            />

                                            {user?.fullName}
                                            <DownOutlined />
                                        </Space>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Function Menu"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p style={{ cursor: 'pointer' }}>Manage account</p>
                <Divider />
                <p style={{ cursor: 'pointer' }}>Purchase history</p>
                <Divider />
                <p style={{ cursor: 'pointer' }}>Logout</p>
                <Divider />
            </Drawer>
        </>
    )
};
export default Header;