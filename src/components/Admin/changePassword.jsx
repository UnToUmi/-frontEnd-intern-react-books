import { Button, Col, Divider, Form, Input, message, Modal, notification, Row, Tabs, } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { callChangePassword } from "../../services/api";
const ChangePassword = (props) => {
    const dataUser = props.dataUser;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const setOpenModal = props.setOpenModal;
    const onFinish = async (values) => {
        const { email, oldpass, newpass } = values;
        setIsSubmit(true);
        const res = await callChangePassword(email, oldpass, newpass);
        if (res && res.data) {
            message.success("Change password successfully!")
            form.setFieldValue("oldpass", "")
            form.setFieldValue("newpass", "")
            setOpenModal(false);
        } else {
            notification.error({
                message: "Having some problem!",
                description: res.message
            })
        }
        setIsSubmit(true);
    };
    useEffect(() => {
        form.setFieldsValue(dataUser)
    }, [dataUser])

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col md={24} >
                    <Form
                        setFieldsValue={dataUser}
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
                            label="Current password"
                            name="oldpass"
                            required
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Replacement Password"
                            name="newpass"
                            required
                        >
                            <Input.Password />
                        </Form.Item>
                        <Col
                            offset={10}
                        >
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: "30%" }}
                                >
                                    Update
                                </Button>
                            </Form.Item>
                        </Col>
                    </Form>
                </Col>
            </Row>

        </>
    )
}
export default ChangePassword;