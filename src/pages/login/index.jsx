import React, { useState } from 'react';
import { Button, Checkbox, Divider, Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { callLogin } from '../../services/api';
import { useDispatch } from 'react-redux';
import { handleLoginAction } from '../../redux/account/accountSlice';


const LoginPage = () => {

    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);
        if (res?.data) {
            // console.log('Check res', res)
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(handleLoginAction(res.data.user))
            message.success('Login success!');
            navigate('/')
        } else {
            notification.error({
                message: "Having some problem!",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };
    return (
        <>
            <div className='login-page' style={{ padding: '50px' }}>
                <h3 style={{ textAlign: 'center' }}>A login page</h3>
                <Divider />
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                        margin: '0 auto',
                        alignContent: 'center'
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit" loading={isSubmit} >
                            Login
                        </Button>
                    </Form.Item>
                    <Divider>Or</Divider>
                    <p className='text text-normal'>
                        Do you haven't a account ?
                        <span>
                            &nbsp;
                            <Link to='/register'>Register</Link>
                        </span>
                    </p>
                </Form>
            </div>
        </>
    )
}
export default LoginPage;