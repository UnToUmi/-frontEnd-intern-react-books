import React, { useState } from "react";
import { Button, Divider, Form, Input, message, Modal, notification } from "antd";
import { callCreateUser } from "../../../services/api";


const UserModalCreate = (props) => {
    const openModalCreate = props.openModalCreate;
    const setOpenModalCreate = props.setOpenModalCreate;
    const fetchUser = props.fetchUser;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { fullName, password, email, phone } = values;
        setIsSubmit(true);
        const res = await callCreateUser(fullName, password, email, phone);
        if (res && res.data) {
            message.success("Created a user is success ");
            form.resetFields();
            setOpenModalCreate(false);
            await fetchUser;
        } else {
            notification.error({
                message: "Have some problem!",
                description: res.message
            })
        }
        setIsSubmit(false)
    };
    return (
        <>
            <Modal
                title="Add a new user"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setOpenModalCreate(false);
                }}
                okText={"Create new"}
                cancelText={"Decline"}
                confirmLoading={isSubmit}
            >
                <Divider />
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Display name"
                        name="fullName"
                        rules={[{ required: true, message: "Please fill your name in the tab" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please fill your password in the tab" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please fill your email in the tab" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Phone Number"
                        name="phone"
                        rules={[{ required: true, message: "Please fill your phone number in the tab" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
};
export default UserModalCreate;