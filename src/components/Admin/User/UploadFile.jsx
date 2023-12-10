import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Modal, notification, Table, Upload } from 'antd';
import * as XLSX from "xlsx";
import { callBulkCreateUser } from '../../../services/api';
import templateFile from './data/template.xlsx?url';
const { Dragger } = Upload;

const UploadFile = (props) => {
    const openUpload = props.openUpload;
    const setOpenUpload = props.setOpenUpload;
    const fetchUser = props.fetchUser;
    const [dataExcel, setDataExcel] = useState([]);


    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("Ok");
        }, 1000);
    };

    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest: dummyRequest,
        // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange: async (info) => {
            const { status } = info.file;

            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }

            if (status === 'done') {
                try {
                    const file = info.fileList[0].originFileObj;
                    const data = await readFileAsync(file);
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const json = XLSX.utils.sheet_to_json(sheet, {
                        header: ["fullName", "email", "phone"],
                        range: 1
                    });

                    console.log("Json", json);

                    if (json && json.length > 0) {
                        setDataExcel(json);
                    }

                    message.success(`${info.file.name} file uploaded successfully.`);
                } catch (error) {
                    console.error("Error processing file:", error);
                    message.error(`${info.file.name} file upload failed.`);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const readFileAsync = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                resolve(data);
            };

            reader.onerror = (e) => {
                reject(e);
            };

            reader.readAsArrayBuffer(file);
        });
    };

    const handelSubmit = async () => {
        const data = dataExcel.map((item, index) => {
            item.password = '123456';
            return item;
        })

        const res = await callBulkCreateUser(data);
        if (res.data) {
            notification.success({
                description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
                message: "Import successfully",
            })
            setDataExcel([]);
            setOpenUpload(false);
            await fetchUser();
        } else {
            notification.error({
                description: res.message,
                message: "Having some problem",
            })
        }
    }

    return (
        <Modal
            title="Import file"
            width={'50vw'}
            open={openUpload}
            onOk={() => handelSubmit()}
            onCancel={() => {
                setDataExcel([]);
                setOpenUpload(false);
            }}
            okText={"Import"}
            cancelText={"Decline"}
            okButtonProps={{
                disabled: dataExcel.length < 1
            }}
            maskClosable={false}
        >
            <Dragger
                {...propsUpload}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload. Only accept file .csv, .xlsx, .xls or
                </p>
                <a
                    style={{ justifyContent: "center" }}
                    onClick={e => e.stopPropagation()}
                    href={templateFile}
                    download
                >
                    Download Sample File
                </a>
            </Dragger>
            <div
                style={{ paddingTop: 20 }}
            >
                <Table
                    dataSource={dataExcel}
                    title={() => <span>Preview the data import:</span>}
                    columns={[
                        { dataIndex: "fullName", title: "Display name" },
                        { dataIndex: "email", title: "Email" },
                        { dataIndex: "phone", title: "Phone number" },
                    ]}
                />
            </div>

        </Modal>
    );

}

export default UploadFile;