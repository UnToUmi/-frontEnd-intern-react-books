import { Badge, Descriptions, Drawer } from "antd";
import moment from "moment/moment";

const UserViewDetail = (props) => {
    const dataViewDetail = props.dataViewDetail;
    const setOpenViewDetail = props.setOpenViewDetail;
    const openViewDetail = props.openViewDetail;
    const onClose = () => {
        setOpenViewDetail(false)
    }

    return (
        <>
            <Drawer
                title="View detail information"
                width={"40%"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="User information"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Display name">{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone number">{dataViewDetail?.phone}</Descriptions.Item>


                    <Descriptions.Item label="Role" span={2}>
                        <Badge status="processing" text={dataViewDetail?.role}></Badge>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>

        </>
    )
}
export default UserViewDetail;