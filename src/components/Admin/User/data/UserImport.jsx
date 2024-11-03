import { Descriptions, Modal, notification, Table } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import * as XLSX from "xlsx";
import { useState } from "react";
import { postListUser } from "../../../../services/apiService";
import templateFile from "./DataTest.xlsx?url";
const { Dragger } = Upload;

const UserImport = (props) => {
  const { setOpenModalImport, openModalImport } = props;
  const [dataExcel, setDataExcel] = useState([]);

  // https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
  // upload without action
  const dummyRequest = ({ file, onSuccess }) => {
    // Chỉ cần gọi hàm onSuccess để ngăn chặn hành vi tải xuống
    setTimeout(() => onSuccess("ok"), 1000);
  };

  // atribute for upload Dragg
  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv

    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    customRequest: dummyRequest,
    // when upload file => onchange
    onChange(info) {
      // console.log(info)
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      // upload success
      if (status === "done") {
        // get file uploaded
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          // create filereader to read file
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);

          reader.onload = function (e) {
            const data = new Uint8Array(reader.result);
            // get file excel
            const workbook = XLSX.read(data, { type: "array" });
            // get sheet 1
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const json = XLSX.utils.sheet_to_json(sheet, {
              // mapping data key - value
              header: ["fullName", "email", "phone"],
              range: 1,
            });
            if (json && json.length > 0) setDataExcel(json);
          };
        }
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleSubmit = async () => {
    const data = dataExcel.map((item) => {
      item.password = "123456";
      return item;
    });
    const res = await postListUser(data);
    if (res.data) {
      notification.success({
        description: `Success : ${res.data.countSuccess}, Error : ${res.data.countError}`,
        message: "Upload thành công!",
      });
      setDataExcel([]);
      setOpenModalImport(false);
      props.fetchUser();
    } else {
      notification.error({
        description: res.message,
        message: "Đã có lỗi xảy ra!",
      });
    }
  };

  return (
    <>
      <Modal
        title="Import data user"
        width={"50vw"}
        open={openModalImport}
        onOk={() => handleSubmit()}
        onCancel={() => {
          setOpenModalImport(false);
          setDataExcel([]);
        }}
        okText="Import data"
        okButtonProps={{
          disabled: dataExcel.length < 1,
        }}
        //do not close when click outside
        maskClosable={false}
      >
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single upload. Only accept .csv, .xls, .xlsx &nbsp;
            <a
              //Ngan hanh vi goi ham len element cha
              onClick={(e) => e.stopPropagation()}
              href={templateFile}
              download
            >
              Download Sample File
            </a>
          </p>
        </Dragger>

        <div style={{ paddingTop: 20 }}>
          <Table
            title={() => <span>Dữ liệu upload:</span>}
            columns={[
              { dataIndex: "fullName", title: "Tên hiển thị" },
              { dataIndex: "email", title: "Email" },
              { dataIndex: "phone", title: "Số điện thoại" },
            ]}
            dataSource={dataExcel}
          />
        </div>
      </Modal>
    </>
  );
};

export default UserImport;
