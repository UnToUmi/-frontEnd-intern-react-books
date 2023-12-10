import { Result, Button, Col, Divider, Empty, InputNumber, Row, Steps } from 'antd';
import './orderPage.scss';
import { DeleteOutlined, LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { handleDeleteCartAction, handleUpdateCartAction } from '../../redux/order/orderSlice';
import Payment from './Payment';
import ViewOrder from './ViewOrder';
import { Navigate, useNavigate } from 'react-router-dom';


const OrderPage = (props) => {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div className='order-steps'>
                    <Steps
                        size='small'
                        current={currentStep}
                        items={[
                            {
                                title: 'Your order',
                                icon: <UserOutlined />,
                            },
                            {
                                title: 'Form order',
                                icon: <SolutionOutlined />,
                            },
                            {
                                title: 'Payment',
                                icon: <SmileOutlined />,
                            },
                        ]}
                    />
                </div>
                <div
                    style={{ marginTop: 20 }}
                >
                    {currentStep === 0 &&
                        <ViewOrder
                            setCurrentStep={setCurrentStep}
                        />
                    }
                    {currentStep === 1 &&
                        <Payment
                            setCurrentStep={setCurrentStep}

                        />
                    }
                    {currentStep === 2 &&
                        <Result
                            icon={<SmileOutlined />}
                            title="You have purchased the books successfully!"
                            extra={<Button
                                type='primary'
                                onClick={() => navigate('/history')}
                            >
                                View the purchase history
                            </Button>}
                        />
                    }
                </div>
            </div>
        </div>
    )
}
export default OrderPage;