import { Col, Row } from "antd";
import "./PopContent.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const PopContent = (props) => {
  const { carts } = props;

  const navigate = useNavigate();

  return (
    <>
      <div className="pop">
        <div className="pop-container">
          {carts.length > 0 ? (
            <>
              {carts.map((item, index) => {
                return (
                  <div className="item" key={`bookCart-${index}`}>
                    <div className="left">
                      <div span={6} className="image">
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/book/${item.detail.thumbnail}`}
                          alt=""
                        />
                      </div>
                    </div>
                    <Col span={18} className="right">
                      <div className="name ellipsis-text">
                        {item.detail.mainText}
                      </div>
                      <div className="price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.detail.price)}
                      </div>
                      <div className="quantity">x{item.quantity}</div>
                    </Col>
                  </div>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="pop-btn">
          <button className="redirect" onClick={() => navigate("/cart")}>
            Xem giỏ hàng
          </button>
        </div>
      </div>
    </>
  );
};

export default PopContent;
