import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Input, message, Modal, Tabs, } from "antd";
import UpdateInfo from "./UpdateInfo";
import { useDispatch, useSelector } from "react-redux";
import ChangePassword from "./ChangePassword";


const ModalManageAccount = (props) => {
    const openModal = props.openModal;
    const setOpenModal = props.setOpenModal;
    const [form] = Form.useForm();

    const [isSubmit, setIsSubmit] = useState(false);

    const dataUser = useSelector(state => state.account.user);
    useEffect(() => {
        form.setFieldsValue(dataUser)
    }, [dataUser])
    return (
        <>
            <Modal
                width={"50vw"}
                title="Manage account"
                open={openModal}
                onCancel={() => {
                    setOpenModal(false);
                    form.setFieldValue(dataUser);
                }}
                confirmLoading={isSubmit}
                footer={null}
                maskClosable={false}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            key: "1",
                            label: 'Update Information',
                            children: <UpdateInfo
                                dataUser={dataUser}
                                setOpenModal={setOpenModal}
                            />
                        },
                        {
                            key: '2',
                            label: 'Change password',
                            children: <ChangePassword
                                dataUser={dataUser}
                                setOpenModal={setOpenModal}
                            />
                        },
                    ]}
                />
                <Divider />
            </Modal>
        </>
    )
};
export default ModalManageAccount;