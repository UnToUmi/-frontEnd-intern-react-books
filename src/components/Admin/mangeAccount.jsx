import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Input, message, Modal, Tabs, } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ChangePassword from "./changePassword";
import UpdateInfo from "./updateAccount";


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
                    defaultActiveKey="info"
                    items={[
                        {
                            key: "info",
                            label: 'Update Information',
                            children: <UpdateInfo
                                dataUser={dataUser}
                                setOpenModal={setOpenModal}
                            />
                        },
                        {
                            key: 'pass',
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