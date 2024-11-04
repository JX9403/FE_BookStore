import { Badge, Descriptions, Divider, Drawer, Modal } from "antd";
import moment from "moment";

import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// library
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const BookViewDetail = (props) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [fileList, setFileList] = useState([]);

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  useEffect(() => {
    if (dataViewDetail) {
      let imgThumbnail = {},
        imgSlider = [];
      if (dataViewDetail.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: dataViewDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataViewDetail.thumbnail
          }`,
        };
      }

      if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
        dataViewDetail.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [dataViewDetail]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
  };

  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        width={"50vw"}
        onClose={onClose}
        open={openViewDetail}
      >
        <Descriptions title="Thông tin sách" bordered column={2}>
          <Descriptions.Item label="Id">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên hiển thị">
            {dataViewDetail?.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Thể loại">
            {dataViewDetail?.category}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {dataViewDetail?.author}
          </Descriptions.Item>

          <Descriptions.Item label="Số lượng">
            {dataViewDetail?.quantity}
          </Descriptions.Item>
          <Descriptions.Item label="Đã bán">
            {dataViewDetail?.sold}
          </Descriptions.Item>
          <Descriptions.Item label="Giá">
            {dataViewDetail?.price &&
              dataViewDetail.price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND"}
          </Descriptions.Item>

          <Descriptions.Item label="Updated At">
            {moment(dataViewDetail?.updatedAt).format("DD-MM-YYYY hh:mm:ss")}
          </Descriptions.Item>
        </Descriptions>

        <Divider>Ảnh</Divider>
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          showUploadList={{ showRemoveIcon: false }}
        ></Upload>
      </Drawer>

      <Modal
        open={previewOpen}
        title={previewTitle}
        // title="Preview Image"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};
export default BookViewDetail;
