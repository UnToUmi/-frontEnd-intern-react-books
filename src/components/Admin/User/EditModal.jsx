import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Input, message, Modal, notification } from "antd";
import { callEditUser } from "../../../services/api";



const EditModal = (props) => {
    const openEdit = props.openEdit;
    const setOpenEdit = props.setOpenEdit;
    const fetchUser = props.fetchUser;
    const dataEdit = props.dataEdit;
    const setDataEdit = props.setDataEdit;

    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { _id, fullName, email, phone } = values;
        setIsSubmit(true);
        const res = await callEditUser(_id, fullName, phone);
        if (res && res.data) {
            message.success("A edit user is success ");
            form.resetFields();
            setOpenEdit(false);
            await fetchUser();
        } else {
            notification.error({
                message: "Have some problem!",
                description: res.message
            })
        }
        setIsSubmit(false)
    };
    useEffect(() => {
        form.setFieldsValue(dataEdit)
    }, [dataEdit])
    return (
        <>
            <Modal
                title="Edit the user"
                open={openEdit}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenEdit(false);
                    form.setFieldsValue(dataEdit)
                }}
                okText={"Edit"}
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
                        label="Email"
                        name="email"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Display name"
                        name="fullName"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        hidden
                        labelCol={{ span: 24 }}
                        label="ID"
                        name="_id"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Phone Number"
                        name="phone"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
};
export default EditModal;