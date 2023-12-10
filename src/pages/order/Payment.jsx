import { Button, Col, Divider, Empty, Form, Input, InputNumber, Radio, Row, Steps, message, notification } from 'antd';
import './orderPage.scss';
import { DeleteOutlined, LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { handleDeleteCartAction, handlePlaceOrderAction, handleUpdateCartAction } from '../../redux/order/orderSlice';
import { useForm } from 'antd/es/form/Form';
import { callPlaceOrder } from '../../services/api';
import TextArea from 'antd/es/input/TextArea';

const Payment = (props) => {
    const [provisionalPrice, setProvisionalPrice] = useState(0);
    const carts = useSelector(state => state.order.carts);
    const user = useSelector(state => state.account.user)
    const dispatch = useDispatch();
    const setCurrentStep = props.setCurrentStep;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const handleOnChangeInput = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(handleUpdateCartAction({ quantity: value, detail: book, _id: book._id }))
        }
    }

    const onFinish = async (values) => {
        setIsSubmit(true);
        const detailOrder = carts.map(item => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                _id: item._id,
            }
        })
        const data = {
            name: values.name,
            address: values.address,
            phone: values.phone,
            totalPrice: provisionalPrice,
            detail: detailOrder,
        }

        const res = await callPlaceOrder(data);
        if (res && res.data) {
            message.success("Purchase the books successfully!");
            dispatch(handlePlaceOrderAction());
            setCurrentStep(2);
        } else {
            notification.error({
                message: "Having some problem!",
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map((item) => {
                sum += item.quantity * item.detail.price;
            })
            setProvisionalPrice(sum);
        } else {
            setProvisionalPrice(0);
        }

    }, [carts]);

    return (
        <Row gutter={[20, 20]}>
            <Col md={16} xs={24}>
                {carts?.map((item, index) => {
                    const currentBookPrice = item?.detail?.price ?? 0;
                    return (
                        <>
                            <div
                                key={`listCart-${index}`}
                                className='order-book'>
                                <div className='book-content'>
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`} />
                                    <div className='title'>
                                        {item?.detail?.mainText}
                                    </div>
                                    <div className='price'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice)}
                                    </div>
                                </div>
                                <div className='action'>
                                    <div className='quantity'>
                                        <InputNumber
                                            value={item?.quantity}
                                            onChange={(value) => handleOnChangeInput(value, item)}
                                        />
                                    </div>
                                    <div className='sum'>
                                        Total: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.quantity * item?.detail?.price)}
                                    </div>
                                    <DeleteOutlined
                                        onClick={() => dispatch(handleDeleteCartAction({ _id: item._id }))}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                            </div>
                        </>
                    )
                })}
                {carts.length === 0 ??
                    <div className='order-book-empty'>
                        <Empty
                            description={"You don't have any book in your cart"}
                        />
                    </div>
                }
            </Col>
            <Col md={8} xs={24} >
                <div className='order-sum'>
                    <Form
                        onFinish={onFinish}
                        form={form}
                    >
                        <Form.Item
                            style={{ margin: 0 }}
                            label="Order name"
                            labelCol={{ span: 24 }}
                            name="name"
                            initialValue={user?.fullName}
                            rules={[{ required: true, message: "You have to fill your name!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            style={{ margin: 0 }}
                            label="Phone number"
                            labelCol={{ span: 24 }}
                            name="phone"
                            initialValue={user?.phone}
                            rules={[{ required: true, message: "You have to fill your phone number!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            style={{ margin: 0 }}
                            label="Address"
                            labelCol={{ span: 24 }}
                            name="address"
                            rules={[{ required: true, message: "You have to fill your address!" }]}
                        >
                            <TextArea
                                autoFocus
                                rows={4}
                            >
                            </TextArea>
                        </Form.Item>

                        <div className='info'>
                            <div className='method'>
                                <div>
                                    Form of payment:
                                </div>
                                <div
                                    style={{ marginTop: 10 }}
                                >
                                    <Radio checked>COD (Cash on delivery)</Radio>
                                </div>

                            </div>
                        </div>
                        <Divider style={{ margin: "10px 0" }} />
                        <div className='calculate'>
                            <span> Price Total: </span>
                            <span className='sum-final'>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(provisionalPrice || 0)}
                            </span>
                        </div>
                        <Divider style={{ margin: "10px 0" }} />
                        <Form.Item>
                            <button
                                onClick={() => form.submit()}
                                disabled={isSubmit}
                            >
                                {isSubmit && <span><LoadingOutlined /> &nbsp;</span>}
                                {`Purchase (${carts?.length ?? 0})`}
                            </button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    )
}
export default Payment;
