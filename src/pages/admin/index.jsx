import React from 'react';
import CountUp from 'react-countup';
import { Card, Col, Row, Statistic } from 'antd';
import { callFetchDashboard } from '../../services/api';
import { useState } from 'react';
import { useEffect } from 'react';
const formatter = (value) => <CountUp end={value} separator="," />;
const Admin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [countOrder, setCountOrder] = useState("");
    const [countUser, setCountUser] = useState("");

    const fetchDashboard = async () => {
        setIsLoading(true);
        const res = await callFetchDashboard();
        console.log("res dashboard: ", res)
        if (res && res.data) {
            setCountOrder(res.data.countOrder);
            setCountUser(res.data.countUser);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchDashboard();
    }, []);

    return (
        <>
            <Row gutter={[20, 20]} >
                <Col span={12}>
                    <Card
                        title="Total user"
                        bordered={false}
                        style={{ width: '80%', marginTop: 30, marginLeft: 30 }}
                    >
                        <Statistic value={countUser} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        title="Total order"
                        bordered={false}
                        style={{ width: '80%', marginTop: 30 }}
                    >
                        <Statistic value={countOrder} precision={2} formatter={formatter} />
                    </Card>
                </Col>
            </Row>
        </>
    )

};
export default Admin;