import React, { useState } from "react";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import { Divider, Badge, Drawer, message, Avatar, Popover } from "antd";
import "./HeaderClient.scss";
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined, FontSizeOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router";
import logo from "../../assets/logo.png";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { postLogout } from "../../services/apiService";
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import PopContent from "./PopContent";
import ManageAccount from "../Account/ManageAccount";
import { validate } from "uuid";
import { Value } from "sass";
import { removeCart } from "../../redux/order/orderSlice";

const HeaderClient = (props) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const carts = useSelector((state) => state.order.carts);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const content = () => {
    return (
      <>
        <PopContent carts={carts} />
      </>
    );
  };

  const handleLogout = async () => {
    const res = await postLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      dispatch(removeCart());
      message.success("Đăng xuất thành công!");
      navigate("/");
    }
  };

  const items = [
    {
      label: (
        <label onClick={() => setIsModalOpen(true)}>Quản lý tài khoản</label>
      ),
      key: "account",
    },
    {
      label: <Link to="/history">Lịch sử mua hàng</Link>,
      key: "history",
    },
    {
      label: <label onClick={() => handleLogout()}>Đăng xuất</label>,
      key: "logout",
    },
  ];

  if (user?.role === "ADMIN") {
    items.unshift({
      label: (
        <label>
          <Link to="/admin">Trang quản trị</Link>
        </label>
      ),
      key: "admin",
    });
  }

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;
  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              ☰
            </div>
            <div className="page-header__logo">
              <span className="logo" onClick={() => navigate("/")}>
                <img src={logo} alt="" />
              </span>
              <input
                onChange={(e) => props.setSearchTerm(e.target.value)}
                className="input-search"
                type={"text"}
                placeholder="Bạn tìm gì hôm nay"
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li
                className="navigation__item"
                style={{
                  height: "100%",
                }}
              >
                <span
                  style={{
                    height: "100%",
                    display: "inline-flex",
                    alignItems: "center",
                    marginRight: "10px",
                  }}
                >
                  <Badge count={carts?.length ?? 0} size={"small"}>
                    <Popover
                      placement="bottomRight"
                      title="Sản phẩm mới thêm"
                      content={content}
                    >
                      <FiShoppingCart className="icon-cart" />
                    </Popover>
                  </Badge>
                </span>
              </li>

              <li
                className="navigation__item mobile"
                style={{
                  height: "100%",
                }}
              >
                {!isAuthenticated ? (
                  <span
                    style={{
                      height: "100%",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    <MdAccountCircle
                      onClick={() => navigate("/login")}
                      style={{ fontSize: "30px" }}
                    />
                  </span>
                ) : (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <a
                      style={{
                        height: "100%",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Avatar src={urlAvatar} />
                    </a>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lý tài khoản</p>
        <Divider />

        <p onClick={() => handleLogout()}>Đăng xuất</p>
        <Divider />
      </Drawer>

      <ManageAccount
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default HeaderClient;
