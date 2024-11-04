import React, { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Select,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import {
  callUploadBookImg,
  getListCategory,
  putUpdateBook,
} from "../../../services/apiService";
import { v4 as uuidv4 } from "uuid";

const BookModalUpdate = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    dataModalUpdate,
    setDataModalUpdate,
    fetchBook,
  } = props;
  // console.log(dataModalUpdate);
  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState([]);

  const [form] = useForm();

  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);

  const [imageUrl, setImageUrl] = useState("");

  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [initForm, setInitForm] = useState({});

  // useEffect(() => {
  //   form.setFieldsValue(dataModalUpdate);
  // }, [dataModalUpdate]);
  const fetchCategory = async () => {
    const res = await getListCategory();
    if (res && res.data) {
      setListCategory(res.data);
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (dataModalUpdate?._id) {
      const arrThumbnail = [
        {
          uid: uuidv4(),
          name: dataModalUpdate.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataModalUpdate.thumbnail
          }`,
        },
      ];

      const arrSlider = dataModalUpdate.slider.map((item) => {
        return {
          uid: uuidv4(),
          name: item,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        };
      });
      const init = {
        _id: dataModalUpdate._id,
        thumbnail: { fileList: arrThumbnail },
        slider: { fileList: arrSlider },
        mainText: dataModalUpdate.mainText,
        author: dataModalUpdate.author,
        price: dataModalUpdate.price,
        sold: dataModalUpdate.sold,
        quantity: dataModalUpdate.quantity,
        category: dataModalUpdate.category,
      };
      setInitForm(init);
      setDataThumbnail(arrThumbnail);
      setDataSlider(arrSlider);
      form.setFieldsValue(init);
    }

    return () => {
      form.resetFields();
    };
  }, [dataModalUpdate]);

  const onFinish = async (values) => {
    if (dataThumbnail.length === 0) {
      notification.error({
        message: "Lỗi validate",
        description: "Vui lòng upload ảnh thumbnail",
      });
      return;
    }
    if (dataSlider.length === 0) {
      notification.error({
        message: "Lỗi validate",
        description: "Vui lòng upload ảnh slider",
      });
      return;
    }
    const { _id, mainText, author, price, sold, quantity, category } = values;
    const thumbnail = dataThumbnail[0].name;
    const slider = dataSlider.map((item) => item.name);
    setIsSubmit(true);
    const res = await putUpdateBook(
      _id,
      thumbnail,
      slider,
      mainText,
      author,
      price,
      sold,
      quantity,
      category
    );
    if (res && res.data) {
      message.success("Cập nhật thành công");
      form.resetFields();
      setDataSlider([]);
      setDataThumbnail([]);
      setInitForm(null);
      setOpenModalUpdate(false);
      await fetchBook();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info, type) => {
    if (info.file.status === "uploading") {
      type ? setLoadingSlider(true) : setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataThumbnail([
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi khi upload file");
    }
  };

  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      //copy previous state => upload multiple images
      setDataSlider((dataSlider) => [
        ...dataSlider,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi khi upload file");
    }
  };

  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setDataThumbnail([]);
    }
    if (type === "slider") {
      const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };

  const handlePreview = async (file) => {
    if (file.url && !file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    }
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };

  const options = listCategory?.map((item) => {
    return {
      value: item,
      label: item,
    };
  });

  return (
    <>
      <Modal
        title="Chỉnh sửa thông tin"
        open={openModalUpdate}
        onOk={() => form.submit()}
        onCancel={() => {
          setOpenModalUpdate(false);
          setInitForm(null);
          setDataModalUpdate(null);
          setOpenModalUpdate(false);
        }}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isSubmit}
        width="50%"
      >
        <Form form={form} onFinish={onFinish} autoComplete="off" name="basic">
          <Row gutter={[20, 0]}>
            <Form.Item
              hidden
              labelCol={{ span: 24 }} //whole column
              label="id"
              name="_id"
            >
              <Input />
            </Form.Item>

            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Tên sách"
                name="mainText"
                rules={[{ required: true, message: "Không được để trống!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tác giả"
                name="author"
                rules={[{ required: true, message: "Không được để trống!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giá"
                name="price"
                rules={[{ required: true, message: "Không được để trống!" }]}
              >
                <InputNumber
                  addonAfter="VND"
                  defaultValue={0}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Thể loại"
                name="category"
                rules={[{ required: true, message: "Không được để trống!" }]}
              >
                <Select
                  // mode="multiple"
                  placeholder="Danh mục"
                  defaultValue={null}
                  options={options}
                  showSearch
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: "Không được để trống!" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Đã bán"
                name="sold"
                rules={[{ required: true, message: "Không được để trống!" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh Thumbnail"
                name="thumbnail"
              >
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadFileThumbnail}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                  onPreview={handlePreview}
                  defaultFileList={initForm?.thumbnail?.fileList ?? []}
                >
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh Slider"
                name="slider"
              >
                <Upload
                  multiple
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleUploadFileSlider}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "slider")}
                  onRemove={(file) => handleRemoveFile(file, "slider")}
                  onPreview={handlePreview}
                  defaultFileList={initForm?.slider?.fileList ?? []}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default BookModalUpdate;
