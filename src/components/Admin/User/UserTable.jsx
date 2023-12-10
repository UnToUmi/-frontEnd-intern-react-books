import React, { useEffect, useState } from 'react';
import { Col, Row, Table, Button, Layout, Popconfirm, message, notification } from 'antd';
import InputSearch from './InputSearch';
import { callDeleteUser, callFetchListUser } from '../../../services/api';
import UserViewDetail from './UserViewDetail';
import { DeleteFilled, DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import UserModalCreate from './UserModalCreate';
import {
    HeartTwoTone

} from "@ant-design/icons";
import UploadFile from './UploadFile';
import moment from 'moment';
import * as XLSX from 'xlsx';
import EditModal from './EditModal';

const { Footer } = Layout;


const UserTable = () => {

    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const [dataViewDetail, setDataViewDetail] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [dataEdit, setDataEdit] = useState("");


    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter, sortQuery]);


    const fetchUser = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await callFetchListUser(query);
        if (res && res.data) {
            setListUser(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    }

    const handleDeleteUser = async (_id) => {
        const res = await callDeleteUser(_id);
        if (res && res.data) {
            message.success("Delete this user successfully!")
            await fetchUser();
        }
        else {
            notification.error({
                message: "Having some problem",
                description: res.message
            });
        }
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            //record lưu thông tin của user tại row ấy
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>

                        {record._id}
                    </a>
                )

            }
        },
        {
            title: 'Display name',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Phone number',
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: "Updated time",
            dataIndex: 'updatedAt',
            sorter: true,
            render: (text, record, index) => {
                return (
                    <p>
                        {moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </p>
                )
            }

        },
        {
            title: 'Action',
            with: 150,
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement="topLeft"
                            title={"Delete user"}
                            description={"Do you want to delete this user?"}
                            onConfirm={() => handleDeleteUser(record._id)}
                            okText="Delete"
                            cancelText="Decline"
                        >
                            <span>
                                <DeleteOutlined
                                    style={{ color: "red", cursor: "pointer" }}
                                />
                            </span>
                        </Popconfirm>
                        <EditOutlined
                            style={{ color: "orange", marginLeft: 20 }}
                            onClick={() => {
                                setOpenEdit(true);
                                setDataEdit(record);
                            }}
                        />

                    </>
                )
            }
        },
    ];
    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}`
                : `sort=-${sorter.field}`;
            setSortQuery(q);
        }
        // console.log('params', pagination, filters, sorter, extra);
    };

    const handleSearch = (query) => {
        setCurrent(1);
        setFilter(query);
    };
    const handleExport = () => {
        if (listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ListUserTable.csv")
        }
    };
    const renderHeader = () => {
        const [openModalCreate, setOpenModalCreate] = useState(false);
        const [openUpload, setOpenUpload] = useState(false);


        return (
            <>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Table List User</span>
                    <span style={{ display: "flex", gap: 15 }}>
                        <Button
                            icon={<ExportOutlined />}
                            type='primary'
                            onClick={() => handleExport()}
                        >
                            Export
                        </Button>
                        <Button
                            icon={<ImportOutlined />}
                            type='primary'
                            onClick={() => setOpenUpload(true)}
                        >
                            Import
                        </Button>
                        <Button
                            icon={<PlusOutlined />}
                            type='primary'
                            onClick={() => setOpenModalCreate(true)}
                        >
                            Add new user
                        </Button>
                        <Button
                            type='ghost'
                            onClick={() => {
                                setFilter("");
                                setSortQuery("");
                            }}
                        >
                            <ReloadOutlined />
                        </Button>
                    </span>
                </div>
                <UserModalCreate
                    openModalCreate={openModalCreate}
                    setOpenModalCreate={setOpenModalCreate}
                />
                <UploadFile
                    openUpload={openUpload}
                    setOpenUpload={setOpenUpload}
                />
            </>
        )
    };
    return (
        <>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <InputSearch
                        handleSearch={handleSearch}
                        setFilter={setFilter}
                    />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        isLoading={isLoading}
                        className='def'
                        columns={columns}
                        dataSource={listUser}
                        onChange={onChange}
                        rowKey="_id"
                        pagination={
                            {
                                pageSizeOptions: [5, 10, 15, 20],
                                showQuickJumper: true,
                                current: current,
                                defaultPageSize: pageSize,
                                showSizeChanger: true,
                                total: total,
                                showTotal: (total, range) => {
                                    return (
                                        <div>
                                            {range[0]}-{range[1]} per {total} rows
                                        </div>
                                    )
                                }
                            }
                        }
                    />
                </Col>
                <Col
                    style={{ marginTop: "20px" }}
                    span={24}>
                    <Footer
                        style={{ padding: 1 }}
                    >
                        Yahallo &copy; 2023. Made with <HeartTwoTone />
                    </Footer>
                </Col>
            </Row >
            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <UserModalCreate
                fetchUser={fetchUser}
            />
            <UploadFile
                fetchUser={fetchUser}
            />
            <EditModal
                openEdit={openEdit}
                setOpenEdit={setOpenEdit}
                fetchUser={fetchUser}
                dataEdit={dataEdit}
                setDataEdit={setDataEdit}
            />
        </>
    )
}

export default UserTable;