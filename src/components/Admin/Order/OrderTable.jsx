import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Popconfirm,
  Button,
  message,
  notification,
} from "antd";
import InputSearch from "./InputSearch";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditOutlined,
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import OrderViewDetail from "./OrderViewDetail";

import * as XLSX from "xlsx";
import { getListOrder } from "../../../services/apiService";
import { render } from "react-dom";
import moment from "moment";
import ReactJson from "react-json-view";

// https://stackblitz.com/run?file=demo.tsx
const OrderTable = () => {
  const [listOrder, setListOrder] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [current, pageSize, filter, sortQuery]);

  const fetchOrder = async () => {
    setIsLoading(true);
    let query = `?current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    // console.log("query<<", query);
    const res = await getListOrder(query);
    if (res && res.data) {
      setListOrder(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };
  // console.log(dataModalUpdate);
  const handleExportData = () => {
    if (listOrder.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listOrder);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportOrders.csv");
    }
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a
            href="#"
            onClick={() => {
              // console.log(record);
              setDataViewDetail(record);
              setOpenViewDetail(true);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      sorter: true,
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: true,
      render: (text, record, index) => {
        return (
          <span>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</span>
        );
      },
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
      render: (text, record, index) => {
        return (
          <span>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</span>
        );
      },
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_, record) => (
        <ReactJson
          src={record.detail}
          name={"Chi tiết đơn mua"}
          collapsed={true}
          enableClipboard={false}
          displayDataTypes={false}
          displayObjectSize={false}
        />
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
    }
  };

  // change button color: https://ant.design/docs/react/customize-theme#customize-design-token
  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Table List Orders</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button
            icon={<ExportOutlined />}
            type="primary"
            onClick={() => handleExportData()}
          >
            Export
          </Button>

          <Button
            type="ghost"
            onClick={() => {
              setFilter("");
              setSortQuery("");
            }}
          >
            <ReloadOutlined />
          </Button>
        </span>
      </div>
    );
  };

  const handleSearch = (query) => {
    console.log("input query", query);
    setFilter(query);
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch handleSearch={handleSearch} setFilter={setFilter} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            columns={columns}
            dataSource={listOrder}
            onChange={onChange}
            rowKey="_id"
            pagination={{
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              total: total,
            }}
          />
        </Col>
      </Row>

      <OrderViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </>
  );
};

export default OrderTable;
