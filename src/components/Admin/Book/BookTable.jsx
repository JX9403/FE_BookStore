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
import BookModalCreate from "./BookModalCreate";
import BookViewDetail from "./BookViewDetail";
// import BookImport from "./data/BookImport";

import BookModalUpdate from "./BookModalUpdate";
import * as XLSX from "xlsx";
import { deleteBook, getListBook } from "../../../services/apiService";
import { render } from "react-dom";
import moment from "moment";

// https://stackblitz.com/run?file=demo.tsx
const BookTable = () => {
  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataModalUpdate, setDataModalUpdate] = useState(null);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filter, sortQuery]);

  const fetchBook = async () => {
    setIsLoading(true);
    let query = `?current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    // console.log("query<<", query);
    const res = await getListBook(query);
    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };
  // console.log(dataModalUpdate);
  const handleExportData = () => {
    if (listBook.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listBook);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportBook.csv");
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
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
      render: (text, record, index) => {
        return (
          <span>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</span>
        );
      },
    },
    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa sách"}
              description={"Bạn có chắc chắn muốn xóa sách này ?"}
              onConfirm={() => handleDeleteBook(record._id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer" }}>
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>

            <span
              onClick={() => {
                // console.log(record);
                setDataModalUpdate(record);
                setOpenModalUpdate(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <EditOutlined style={{ color: "#ffdc26", marginLeft: "12px" }} />
            </span>
          </>
        );
      },
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

  const handleDeleteBook = async (bookId) => {
    const res = await deleteBook(bookId);
    if (res && res.data) {
      message.success("Xóa sách thành công");
      fetchBook();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  // change button color: https://ant.design/docs/react/customize-theme#customize-design-token
  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Table List Books</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button
            icon={<ExportOutlined />}
            type="primary"
            onClick={() => handleExportData()}
          >
            Export
          </Button>

          {/* <Button
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => setOpenModalImport(true)}
          >
            Import
          </Button> */}

          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
          >
            Thêm mới
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
            dataSource={listBook}
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
      <BookModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchBook={fetchBook}
      />

      <BookModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataModalUpdate={dataModalUpdate}
        setDataModalUpdate={setDataModalUpdate}
        fetchBook={fetchBook}
      />

      <BookViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </>
  );
};

export default BookTable;
