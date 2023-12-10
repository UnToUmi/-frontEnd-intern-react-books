import { Result, Button, Col, Divider, Empty, InputNumber, Row, Steps } from 'antd';
import './orderPage.scss';
import { DeleteOutlined, LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { handleDeleteCartAction, handleUpdateCartAction } from '../../redux/order/orderSlice';


const ViewOrder = (props) => {
    const [provisionalPrice, setProvisionalPrice] = useState(0);
    const carts = useSelector(state => state.order.carts);
    const dispatch = useDispatch();
    const setCurrentStep = props.setCurrentStep;
    const [disabled, setDisabled] = useState(false);


    const handleOnChangeInput = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(handleUpdateCartAction({ quantity: value, detail: book, _id: book._id }))
        }
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
            setDisabled(true);
        }

    }, [carts]);

    return (
        <Row gutter={[20, 20]}>
            <Col md={18} xs={24}>
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
                                        style={{ color: "#ee4d2d" }}
                                        onClick={() => dispatch(handleDeleteCartAction({ _id: item._id }))}
                                    />
                                </div>
                            </div>
                        </>
                    )
                })}
                {carts.length === 0 &&
                    <div className='order-book-empty'>
                        <Empty
                            description={"You don't have any book in your cart"}
                        />
                    </div>
                }
            </Col>
            <Col md={6} xs={24} >
                <div className='order-sum'>
                    <div className='calculate'>
                        <span>  Provisional price: </span>
                        <span>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(provisionalPrice || 0)}
                        </span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <div className='calculate'>
                        <span> Price Total: </span>
                        <span className='sum-final'>  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(provisionalPrice || 0)} </span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <button
                        disabled={disabled}
                        onClick={() => { setCurrentStep(1) }}
                    >{`Purchase (${carts?.length ?? 0})`}</button>
                </div>
            </Col>
        </Row>
    )
}
export default ViewOrder;