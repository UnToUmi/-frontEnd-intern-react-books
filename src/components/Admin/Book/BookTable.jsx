import React, { useEffect, useState } from 'react';
import { Col, Row, Table, Button, Layout, Popconfirm, message, notification } from 'antd';
import InputSearch from './InputSearch';
import { callDeleteBook, callFetchListBook } from '../../../services/api';
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import BookModalCreate from './BookModalCreate';
import {
    HeartTwoTone

} from "@ant-design/icons";
import moment from 'moment';
import * as XLSX from 'xlsx';
import BookEditModal from './BookEditModal';
import BookViewDetail from './BookViewDetail';
import { TbCurrencyDong } from "react-icons/tb";

const { Footer } = Layout;


const BookTable = () => {

    const [listBook, setListBook] = useState([]);
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
        fetchBook();
    }, [current, pageSize, filter, sortQuery]);


    const fetchBook = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await callFetchListBook(query);
        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    }

    const handleDeleteBook = async (_id) => {
        const res = await callDeleteBook(_id);
        if (res && res.data) {
            message.success("Delete the book successfully!")
            await fetchBook();
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
                    <a onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>

                        {record._id}
                    </a>
                )

            }
        },
        {
            title: 'Book name',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            sorter: true,
        },

        {
            title: 'Price',
            dataIndex: 'price',
            sorter: true,
            render: (text, record, index) => {
                return (
                    <p>
                        {new Intl.NumberFormat('de-DE').format(record.price)}<TbCurrencyDong />
                    </p>
                )
            }
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
            width: "100px",
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement="topLeft"
                            title={"Delete book"}
                            description={"Do you want to delete this book?"}
                            onConfirm={() => handleDeleteBook(record._id)}
                            okText="Delete"
                            cancelText="Decline"
                        >
                            <span>
                                <DeleteOutlined
                                    style={{ color: "red", cursor: "pointer" }}
                                />
                            </span>
                        </Popconfirm>
                        <span>
                            <EditOutlined
                                style={{ color: "orange", marginLeft: 20 }}
                                onClick={() => {
                                    setOpenEdit(true);
                                    setDataEdit(record);
                                }}
                            />
                        </span>
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
        setFilter(query)
    };
    const handleExport = () => {
        if (listBook.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listBook);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "listBookTable.csv")
        }
    };
    const renderHeader = () => {
        const [openModalCreate, setOpenModalCreate] = useState(false);


        return (
            <>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Table List Book</span>
                    <span style={{ display: "flex", gap: 15 }}>
                        <Button
                            icon={<ExportOutlined />}
                            type='primary'
                            onClick={() => handleExport()}
                        >
                            Export
                        </Button>
                        <Button
                            icon={<PlusOutlined />}
                            type='primary'
                            onClick={() => setOpenModalCreate(true)}
                        >
                            Add new book
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
                <BookModalCreate
                    openModalCreate={openModalCreate}
                    setOpenModalCreate={setOpenModalCreate}
                    fetchBook={fetchBook}
                />
            </>
        )
    };
    return (
        <>
            <Row gutter={[20, 20]}>
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
                        dataSource={listBook}
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
            <BookViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <BookModalCreate
                fetchBook={fetchBook}
            />
            <BookEditModal
                openEdit={openEdit}
                setOpenEdit={setOpenEdit}
                fetchBook={fetchBook}
                dataEdit={dataEdit}
                setDataEdit={setDataEdit}
            />
        </>
    )
}

export default BookTable;