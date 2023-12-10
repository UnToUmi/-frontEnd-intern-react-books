import React, { useEffect, useState } from 'react';
import { Col, Row, Table, Button, Layout, Popconfirm, message, notification } from 'antd';
import {
    HeartTwoTone

} from "@ant-design/icons";
import moment from 'moment';

import { callFetchBookById, callFetchListOrder } from "../../services/api";
import { TbCurrencyDong } from 'react-icons/tb';
import ViewDetailOrder from './ViewDetailOrder';

const { Footer } = Layout;

const renderHeader = () => {
    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Table List Order</span>

            </div>
        </>
    )
};
const AdminOrder = () => {

    const [listOrder, setListOrder] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const [dataViewDetail, setDataViewDetail] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);
    // const [bookInfor, setBookInfor] = useState("");
    // const [idBook, setIdBook] = useState([]);

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
                        // setIdBook(record.detail[index]._id)
                        // fetchBookInfor(idBook)
                    }}>

                        {record._id}
                    </a>
                )

            }
        },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            sorter: true,
            render: (text, record, index) => {
                return (
                    <p>
                        {new Intl.NumberFormat('de-DE').format(record.totalPrice)}<TbCurrencyDong />
                    </p>
                )
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
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

    const fetchOrder = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await callFetchListOrder(query);
        if (res && res.data) {
            setListOrder(res.data.result);
            setTotal(res.data.meta.total);
        }

        setIsLoading(false);
    }

    // useEffect(() => {
    //     fetchBookInfor(idBook);
    // }, [idBook]);

    // const fetchBookInfor = async (idBook) => {
    //     const res = await callFetchBookById(idBook);
    //     if (res && res.data) {
    //         setBookInfor(res);
    //         console.log("res: ", res)
    //     }
    // }

    useEffect(() => {
        fetchOrder();
    }, [current, pageSize, filter, sortQuery]);

    // console.log("BookInfor: ", bookInfor)
    // console.log("dataView", dataViewDetail)
    // console.log("idBook", idBook)
    // console.log("bookInfor", bookInfor)


    return (
        <>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        isLoading={isLoading}
                        className='def'
                        columns={columns}
                        dataSource={listOrder}
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
            </Row>
            <ViewDetailOrder
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                openViewDetail={openViewDetail}
            // bookInfor={bookInfor}
            />
        </>
    )
}
export default AdminOrder;