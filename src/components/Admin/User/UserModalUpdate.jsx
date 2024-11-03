import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { putUpdateUser } from "../../../services/apiService";

const UserModalUpdate = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    dataModalUpdate,
    setDataModalUpdate,
    fetchUser,
  } = props;
  const [isSubmit, setIsSubmit] = useState(false);

  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(dataModalUpdate);
  }, [dataModalUpdate]);
  const onFinish = async (values) => {
    console.log(values);
    setIsSubmit(true);
    const res = await putUpdateUser(values);
    if (res && res.data) {
      // console.log(res);
      message.success("Chỉnh sửa thành công!");
      setDataModalUpdate(null);
      setOpenModalUpdate(false);
      fetchUser();
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
        title="Chỉnh sửa thông tin"
        open={openModalUpdate}
        onOk={() => form.submit()}
        onCancel={() => {
          setOpenModalUpdate(false);
          setDataModalUpdate(null);
        }}
        okText="Chỉnh sửa"
        cancelText="Hủy"
        confirmLoading={isSubmit}
      >
        <Form form={form} onFinish={onFinish} autoComplete="off" name="basic">
          <Form.Item
            hidden
            labelCol={{ span: 24 }} //whole column
            label="id"
            name="_id"
            rules={[{ required: true, message: "Họ tên không được để trống!" }]}
          >
            <Input />
          </Form.Item>
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
            <Input disabled={true} />
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

export default UserModalUpdate;
