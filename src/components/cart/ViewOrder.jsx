import { DeleteOutlined, DeleteTwoTone } from "@ant-design/icons";
import { Col, Empty, InputNumber, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./ViewOrder.scss";
import {
  doDeleteItemCartAction,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";
import { useEffect, useState } from "react";

const ViewOrder = (props) => {
  const { setCurrentStep } = props;
  const carts = useSelector((state) => state.order.carts);
  const dispatch = useDispatch();

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

  const handleChangeInput = (value, book) => {
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateCartAction({ quantity: value, detail: book, _id: book._id })
      );
    }
  };

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
                          <InputNumber
                            onChange={(value) => handleChangeInput(value, item)}
                            value={item.quantity}
                          />
                        </div>
                      </Col>
                      <Col span={6} className="flex-center">
                        <div className="allprice center">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.detail.price * item.quantity)}
                        </div>
                      </Col>
                      <Col span={1} className="flex-center">
                        <div className="delete">
                          <DeleteTwoTone
                            twoToneColor="#ff4d4f"
                            onClick={() =>
                              dispatch(
                                doDeleteItemCartAction({ _id: item._id })
                              )
                            }
                          />
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
            <div className="pricebefore ">
              <div className="label">Tạm tính :</div>
              <div className="text-left">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice || 0)}
              </div>
            </div>
            <div className="pricefinal ">
              <div className="label">Tổng tiền : </div>
              <div className="final text-left">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice || 0)}
              </div>
            </div>
            <div className="btn-pay center" onClick={() => setCurrentStep(1)}>
              Mua hàng ({carts.length})
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ViewOrder;
