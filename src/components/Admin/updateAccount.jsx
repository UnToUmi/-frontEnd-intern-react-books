import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Divider, Form, Input, message, Modal, notification, Row, Tabs, Upload, } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callUpdateAvatar, callUpdateUserInfo } from "../../services/api";
import { handleChangeAvatarWhenClose, handleUpdateUserInfoAction, handleUploadAvatarAction } from "../../redux/account/accountSlice";

const UpdateInfo = (props) => {
    const dataUser = props.dataUser;
    const [userAvatar, setUserAvatar] = useState(dataUser?.avatar ?? "")
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [isSubmit, setIsSubmit] = useState(false);
    const tempAvatar = useSelector(state => state.account.tempAvatar);
    const setOpenModal = props.setOpenModal;
    const _id = useSelector(state => state.account.user.id)


    const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
        const res = await callUpdateAvatar(file);
        if (res && res.data) {
            const newAvatar = res.data.fileUploaded;
            dispatch(handleUploadAvatarAction({ avatar: newAvatar }));
            setUserAvatar(newAvatar);
            onSuccess('ok')
        } else {
            onError('Having some problem!');
        }
    };

    const propsUpload = {
        name: 'file',
        customRequest: handleUploadAvatar,
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        onChange(info) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                message.success(`Upload your avatar successfully!`);
            } else if (info.file.status === 'error') {
                message.error(` Upload your avatar failed!`);
            }
        },
    };

    const onFinish = async (values) => {
        const { fullName, phone } = values;
        setIsSubmit(true);
        const res = await callUpdateUserInfo(_id, phone, fullName, userAvatar)

        if (res && res.data) {
            dispatch(handleUpdateUserInfoAction({ avatar: userAvatar, phone, fullName }));
            message.success("Update the user successfully");
            localStorage.removeItem("access_token");
            setOpenModal(false);
        } else {
            notification.error({
                message: "Having some problem!",
                description: res.message
            })
        }
        setIsSubmit(false);
    };


    useEffect(() => {
        form.setFieldsValue(dataUser)
    }, [dataUser])

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col md={10} >
                    <Col
                        offset={5}
                        style={{ marginTop: 10 }}
                    >
                        <Avatar
                            span={24}
                            size={120}
                            icon={<UserOutlined />}
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${tempAvatar || dataUser?.avatar}`}
                        />
                        <Upload
                            {...propsUpload}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                style={{ marginTop: 20, marginLeft: -10 }}
                            >Upload avatar</Button>
                        </Upload>
                    </Col>
                </Col>
                <Col md={14} >
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
                            label="Display name"
                            name="fullName"
                            required
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Phone Number"
                            name="phone"
                            required
                        >
                            <Input />
                        </Form.Item>
                        <Col
                            offset={9}
                        >
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
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
export default UpdateInfo;