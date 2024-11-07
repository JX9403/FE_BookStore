import React, { useState } from "react";
import { Button, Col, Form, Input, Row, theme } from "antd";

const InputSearch = (props) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values) => {
    // console.log(values);
    let query = "";
    //build query

    if (values._id) {
      query += `&_id=/${values._id}/i`;
    }

    if (values.name) {
      query += `&name=/${values.name}/i`;
    }

    // console.log("check query", query);

    if (query) {
      // console.log(query);
      props.handleSearch(query);
    }
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item labelCol={{ span: 24 }} name={`_id`} label={`ID`}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={`name`}
            label={`Tên khách hàng`}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              form.resetFields();
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default InputSearch;
