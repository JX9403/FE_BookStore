import { DeleteOutlined, DeleteTwoTone } from "@ant-design/icons";
import { Button, Col, Empty, InputNumber, Result, Row, Steps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./CartPage.scss";
import {
  doDeleteItemCartAction,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";
import { useEffect, useState } from "react";
import ViewOrder from "../../components/cart/ViewOrder";
import Payment from "../../components/cart/Payment";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  // console.log(currentStep);
  const navigate = useNavigate();
  return (
    <>
      <div className="cart">
        <Row gutter={[20, 20]}>
          <Col span={24} className="top">
            <Steps
              current={currentStep}
              size="small"
              items={[
                {
                  title: "Đơn hàng",
                },
                {
                  title: "Thanh toán",
                },
                {
                  title: "Hoàn thành",
                },
              ]}
            />
          </Col>
        </Row>
        {currentStep === 0 && <ViewOrder setCurrentStep={setCurrentStep} />}

        {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}

        {currentStep === 2 && (
          <Result
            status="success"
            title="Đặt hàng thành công!"
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </Button>,
            ]}
          />
        )}
      </div>
    </>
  );
};

export default CartPage;
