import { Badge, Descriptions, Divider, Drawer, Modal } from "antd";
import moment from "moment";

import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ReactJson from "react-json-view";

const OrderViewDetail = (props) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  useEffect(() => {}, [dataViewDetail]);

  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        width={"50vw"}
        onClose={onClose}
        open={openViewDetail}
      >
        <Descriptions title="Thông tin đơn hàng" bordered column={1}>
          <Descriptions.Item label="Id">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên khách hàng">
            {dataViewDetail?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {dataViewDetail?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {dataViewDetail?.phone}
          </Descriptions.Item>

          <Descriptions.Item label="Hình thức thanh toán">
            {dataViewDetail?.type}
          </Descriptions.Item>

          <Descriptions.Item label="Tổng tiền">
            {dataViewDetail?.totalPrice &&
              dataViewDetail.totalPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND"}
          </Descriptions.Item>
          <Descriptions.Item label="Chi tiết đơn hàng">
            <ReactJson
              src={dataViewDetail?.detail}
              name={"Chi tiết đơn mua"}
              collapsed={true}
              enableClipboard={false}
              displayDataTypes={false}
              displayObjectSize={false}
            />
          </Descriptions.Item>

          <Descriptions.Item label="Updated At">
            {moment(dataViewDetail?.updatedAt).format("DD-MM-YYYY hh:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};
export default OrderViewDetail;
