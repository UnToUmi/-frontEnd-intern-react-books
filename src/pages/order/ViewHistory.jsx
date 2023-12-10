import React, { useEffect, useState } from 'react';
import { Col, Row, Table, Button, Layout, Popconfirm, message, notification, Tag } from 'antd';
import moment from 'moment';
import { TbCurrencyDong } from "react-icons/tb";
import { callViewHistory } from '../../services/api';
import { CheckCircleOutlined, HeartTwoTone } from '@ant-design/icons';
import ReactJson from 'react-json-view';

const { Footer } = Layout;


const BookTable = () => {

    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");


    useEffect(() => {
        fetchView();
    }, [current, pageSize, filter, sortQuery]);


    const fetchView = async () => {
        setIsLoading(true);
        const res = await callViewHistory();
        console.log("res: ", res)
        if (res && res.data) {
            setListBook(res.data);
        }
        setIsLoading(false);
    }

    const columns = [
        {
            title: "Ordinal number",
            render: (text, record, index) => {
                return (
                    <p>
                        {index + 1}
                    </p>
                )
            }
        },
        {
            title: "Order time",
            dataIndex: 'createdAt',
            render: (text, record, index) => {
                return (
                    <p>
                        {moment(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </p>
                )
            }
        },
        {
            title: 'Total price',
            dataIndex: 'totalPrice',
            render: (text, record, index) => {
                return (
                    <p>
                        {new Intl.NumberFormat('de-DE').format(record.totalPrice)}<TbCurrencyDong />
                    </p>
                )
            }
        },
        {
            title: 'Status',
            render: (text, record, index) => {
                return (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Success
                    </Tag>

                )
            }
        },
        {
            title: "Order detail",
            render: (text, record, index) => {
                return (
                    <ReactJson
                        enableClipboard={false}
                        displayDataTypes={false}
                        displayObjectSize={false}
                        src={record.detail}
                        name="Order detail: "
                        collapsed={true}

                    />
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

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <h3>Purchase history:</h3>
                    <Table
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
            </Row >
        </>
    )
};

export default BookTable;