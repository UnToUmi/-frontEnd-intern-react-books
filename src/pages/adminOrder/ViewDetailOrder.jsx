import { Badge, Descriptions, Drawer } from "antd";
import moment from "moment/moment";

const ViewDetailOrder = (props) => {
    const dataViewDetail = props.dataViewDetail;
    const setOpenViewDetail = props.setOpenViewDetail;
    const openViewDetail = props.openViewDetail;
    const bookInfor = props.bookInfor;
    const onClose = () => {
        setOpenViewDetail(false)
    }

    return (
        <>
            <Drawer
                title="View detail order"
                width={"40%"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Order information"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Customer name">{dataViewDetail?.name}</Descriptions.Item>
                    <Descriptions.Item label="Phone number" span={2}>{dataViewDetail?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Form of Delivery" span={2}>
                        <Badge status="processing" text={dataViewDetail?.type}></Badge>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address" span={2}>{dataViewDetail?.address}</Descriptions.Item>
                </Descriptions>
                {dataViewDetail?.detail?.map((item, index) => {
                    return (
                        <>
                            <Descriptions
                                bordered
                                column={3}
                            >
                                <Descriptions.Item span={1} label="Book name">{item.bookName}</Descriptions.Item>
                                <Descriptions.Item span={1} label="Quantity">{item.quantity}</Descriptions.Item>
                                {/* {bookInfor?.data?.map((item, index) => {
                                    return (
                                        <Descriptions.Item span={1} label="Price">{item.data[index].price}</Descriptions.Item>
                                    )
                                })} */}

                            </Descriptions>
                        </>
                    )
                })}
            </Drawer>
        </>
    )
}
export default ViewDetailOrder;
