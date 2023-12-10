import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Space, theme } from 'antd';

const InputSearch = (props) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();



    const onFinish = (values) => {

        let query = "";

        if (values.mainText) {
            query += `&mainText=/${values.mainText}/i`
        }
        if (values.author) {

            query += `&author=/${values.author}/i`

        }
        if (values.category) {
            query += `&category=/${values.category}/i`
        }
        if (query) {
            props.handleSearch(query)

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
                            name={'mainText'}
                            label={'Name book'}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={'author'}
                            label={'Author'}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={'category'}
                            label={'Category'}
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