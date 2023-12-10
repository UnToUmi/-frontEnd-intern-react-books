import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Space, theme } from 'antd';

const InputSearch = (props) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        let query = "";

        if (values.fullName) {
            query += `&fullName=/${values.fullName}/i`
        }
        if (values.email) {
            query += `&email=/${values.email}/i`
        }
        if (values.phone) {
            query += `&phone=/${values.phone}/i`
        }
        if (query) {
            props.handleSearch(query);
        }
    };
    const onReset = () => {
        form.resetFields();
        props.setFilter("");

    };

    return (
        <>
            <Form
                form={form}
                name="advanced_search"
                onFinish={onFinish}
            >
                <Row gutter={24}
                >
                    <Col span={8}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={'fullName'}
                            label={'Name'}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={'email'}
                            label={'Email'}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={'phone'}
                            label={'Phone number'}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    style={{ textAlign: 'right' }}
                >

                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: '12px' }}
                    >
                        Search
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                </Form.Item>
            </Form >
        </>
    );
};
export default InputSearch;