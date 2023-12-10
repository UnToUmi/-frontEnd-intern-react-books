import { Badge, Descriptions, Divider, Drawer } from "antd";
import moment from "moment/moment";
import { TbCurrencyDong } from "react-icons/tb";
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const BookViewDetail = (props) => {
    const dataViewDetail = props.dataViewDetail;
    const setOpenViewDetail = props.setOpenViewDetail;
    const openViewDetail = props.openViewDetail;
    const setDataViewDetail = props.setDataViewDetail;


    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (dataViewDetail) {
            let imgThumbnail = {}, imgSlider = [];
            if (dataViewDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail.thumbnail}`,
                }
            }
            if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
                dataViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: "done",
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }

    }, [dataViewDetail])
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        console.log("Picture: ", file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        setPreviewOpen(true);
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    return (
        <>
            <Drawer
                title="View detail information"
                width={"40%"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Book information"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Book name">{dataViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Author">{dataViewDetail?.author} </Descriptions.Item>
                    <Descriptions.Item label="Price">{new Intl.NumberFormat('de-DE').format(dataViewDetail?.price)}<TbCurrencyDong /></Descriptions.Item>
                    <Descriptions.Item label="Quantity">{dataViewDetail?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Sold">{dataViewDetail?.sold}</Descriptions.Item>


                    <Descriptions.Item label="Category" span={2}>
                        <Badge status="processing" text={dataViewDetail?.category}></Badge>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
                <div>
                    <Divider orientation="left">
                        <h4
                            style={{ marginLeft: 0 }}
                        >Book image:</h4>
                    </Divider>
                </div>


                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >
                </Upload>
                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}>
                    <img
                        alt="example"
                        style={{
                            width: '100%',
                        }}
                        src={previewImage}
                    />
                </Modal>
            </Drawer>

        </>
    )
}
export default BookViewDetail;