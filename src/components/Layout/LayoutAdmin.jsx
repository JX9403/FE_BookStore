import React, { useState } from "react";
import {
  AppstoreOutlined,
  ExceptionOutlined,
  HeartTwoTone,
  TeamOutlined,
  UserOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, message, Avatar } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LayoutAdmin.scss";
import { useDispatch, useSelector } from "react-redux";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { postLogout } from "../../services/apiService";

const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const user = useSelector((state) => state.account.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;
  const handleLogout = async () => {
    const res = await postLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công!");
      navigate("/");
    }
  };

  const items = [
    {
      label: <Link to="/admin">Dashboard</Link>,
      key: "dashboard",
      icon: <AppstoreOutlined />,
    },
    {
      label: <Link to="/admin/user">Manage Users</Link>,
      // key: 'user',
      icon: <UserOutlined />,
      key: "user",
    },
    {
      label: <Link to="/admin/book">Manage Books</Link>,
      key: "book",
      icon: <ExceptionOutlined />,
    },
    {
      label: <Link to="/admin/order">Manage Orders</Link>,
      key: "order",
      icon: <DollarCircleOutlined />,
    },
  ];
  const itemsDropdown = [
    {
      label: (
        <label>
          <Link to="/">Trang chủ</Link>
        </label>
      ),
      key: "homepage",
    },
    {
      label: <label>Quản lý tài khoản</label>,
      key: "account",
    },
    {
      label: <label onClick={() => handleLogout()}>Đăng xuất</label>,
      key: "logout",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }} className="layout-admin">
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{ height: 32, margin: 16, textAlign: "center" }}>Admin</div>
        <Menu
          defaultSelectedKeys={[activeMenu]}
          mode="inline"
          items={items}
          onClick={(e) => setActiveMenu(e.key)}
        />
      </Sider>
      <Layout>
        <div className="admin-header">
          <span>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </span>
          <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar src={urlAvatar} />
                {user?.fullName}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <Content>
          <div className="admin-content">
            <Outlet />
          </div>
        </Content>
        <Footer style={{ padding: 0 }}>
          Diemdt9403@gmail.com <HeartTwoTone />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
