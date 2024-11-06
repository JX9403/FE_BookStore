import { DeleteOutlined, DeleteTwoTone } from "@ant-design/icons";
import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Radio,
  Row,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./Payment.scss";
import {
  doDeleteItemCartAction,
  doPlaceOrder,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { postOrder } from "../../services/apiService";

const Payment = (props) => {
  const carts = useSelector((state) => state.order.carts);
  // console.log(carts);
  const user = useSelector((state) => state.account.user);
  const dispatch = useDispatch();
  const [form] = useForm();
  const initialValue = {
    name: user.fullName,
    phone: user.phone,
    address: "",
    totalPrice: 0,
  };

  useEffect(() => {
    form.setFieldsValue(initialValue);
  }, []);

  const onFinish = async (values) => {
    console.log("Success:", values);
    // console.log("cart:", carts.detail);
    const cartDetails = carts.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id,
      };
    });

    const data = {
      name: values.name,
      phone: values.phone,
      address: values.address,
      totalPrice: totalPrice,
      detail: cartDetails,
    };

    const res = await postOrder(data);
    if (res && res.data) {
      message.success("Đặt hàng thành công!");
      dispatch(doPlaceOrder());
      props.setCurrentStep(2);
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  useEffect(() => {
    if (carts && carts.length > 0) {
      let ans = 0;
      carts?.map((item) => {
        ans += item.detail.price * item.quantity;
      });
      setTotalPrice(ans);
    }
    if (carts.length === 0) {
      setTotalPrice(0);
    }
  }, [carts]);

  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <>
      <Row gutter={[20, 20]} className="cart-container">
        <Col span={18} className="left">
          {carts.length === 0 ? (
            <div className="flex-center" style={{ height: "100%" }}>
              <Empty description="Bạn chưa thêm sản phẩm nào!" />
            </div>
          ) : (
            <>
              {carts?.map((item, index) => {
                return (
                  <div className="left-item" key={`cartitem-${index}`}>
                    <Row>
                      <Col span={2}>
                        <div className="image">
                          <img
                            src={`${
                              import.meta.env.VITE_BACKEND_URL
                            }/images/book/${item.detail.thumbnail}`}
                          />
                        </div>
                      </Col>
                      <Col span={8} className="flex-center">
                        <div className="name center ">
                          {item.detail.mainText}
                        </div>
                      </Col>
                      <Col span={4} className="flex-center">
                        <div className="price center ">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.detail.price)}
                        </div>
                      </Col>
                      <Col span={3} className="flex-center">
                        <div className="quantity ">
                          <InputNumber disabled value={item.quantity} />
                        </div>
                      </Col>
                      <Col span={7} className="flex-center">
                        <div className="allprice center">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.detail.price * item.quantity)}
                        </div>
                      </Col>
                    </Row>
                  </div>
                );
              })}
            </>
          )}
        </Col>
        <Col span={6} className="right">
          <div className="right-item">
            <Form
              form={form}
              name="basic"
              labelCol={{
                span: 24,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Tên người nhận"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống!",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Địa chỉ nhận"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống!",
                  },
                ]}
              >
                <TextArea rows={6} />
              </Form.Item>

              <Form.Item label="Hình thức thanh toán">
                <Radio.Group>
                  <Radio defaultChecked={1}> Thanh toán khi nhận hàng </Radio>
                </Radio.Group>
              </Form.Item>
              <div className="pricefinal ">
                <div className="label">Tổng tiền : </div>
                <div className="final text-left">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice || 0)}
                </div>
              </div>
              <Form.Item>
                <div className="btn-pay center" onClick={() => form.submit()}>
                  Đặt hàng
                </div>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Payment;
