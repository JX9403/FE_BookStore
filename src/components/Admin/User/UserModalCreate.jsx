import React, { useState } from "react";
import { Button, Form, Input, message, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { postCreateUser } from "../../../services/apiService";

const UserModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = useForm();

  const onFinish = async (values) => {
    // console.log(values);
    setIsSubmit(true);
    const res = await postCreateUser(values);
    if (res && res.data) {
      console.log(res);
      message.success("Taọ mới thành công!");
      form.resetFields();
      setOpenModalCreate(false);
    } else {
      notification.error({
        message: "Error!",
        description:
          res.message && res.message.length > 0 ? res.message[0] : res.message,
        duration: 5,
      });
    }
    setIsSubmit(false);
  };
  return (
    <>
      <Modal
        title="Thêm mới người dùng"
        open={openModalCreate}
        onOk={() => form.submit()}
        onCancel={() => setOpenModalCreate(false)}
        okText="Tạo mới"
        cancelText="Hủy"
        confirmLoading={isSubmit}
      >
        <Form form={form} onFinish={onFinish} autoComplete="off" name="basic">
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Họ tên không được để trống!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email không được để trống!" }]}
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
            labelCol={{ span: 24 }} //whole column
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Số điện thoại không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserModalCreate;
