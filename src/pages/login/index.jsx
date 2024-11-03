import { Button, Divider, Form, Input, message, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import { useState } from "react";
import { postLogin } from "../../services/apiService";
import { useDispatch } from "react-redux";
import {
  doGetAccountAction,
  doLoginAction,
} from "../../redux/account/accountSlice";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const { username, password } = values;

    setIsLoading(true);
    const res = await postLogin(username, password);
    setIsLoading(false);

    if (res?.data) {
      localStorage.setItem("access_token", res.data.access_token);
      console.log("Check res login <<", res.data);
      dispatch(doLoginAction(res.data.user));

      message.success("Login successfully!");
      navigate("/");
    } else {
      notification.error({
        message: "Error!",
        description:
          res.message && Array.isArray(res.message) > 0
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }

    console.log("req:", values);
    console.log("response:", res);
  };

  return (
    <div className="login-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng Nhập</h2>
              <Divider />
            </div>
            <Form
              name="basic"
              // style={{ maxWidth: 600, margin: '0 auto' }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Tên đăng nhập"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Tên đăng nhập không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
              // wrapperCol={{ offset: 6, span: 16 }}
              >
                <Button type="primary" htmlType="submit" loading={false}>
                  Đăng nhập
                </Button>
              </Form.Item>
              <Divider>Or</Divider>
              <p className="text text-normal">
                Bạn chưa có tài khoản ?
                <span>
                  <Link to="/register"> Đăng ký </Link>
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
