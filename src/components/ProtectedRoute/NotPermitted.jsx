import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import React from "react";

const NotPermitted = () => {
    const navigate = useNavigate();

    return (
        <>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, You haven't authorize to access this page!"
                extra={<Button type="primary"
                    onClick={() => navigate('/')}>
                    Back home
                </Button>}
            >
            </Result>
        </>
    )
}
export default NotPermitted;