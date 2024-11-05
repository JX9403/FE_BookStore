import { useLocation } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import { Button, Col, Rate, Row } from "antd";
import "./BookPage.scss";
import { useEffect, useState } from "react";
import { getBookById } from "../../services/apiService";
import BookLoader from "./BookLoader";
import { useDispatch } from "react-redux";
import { doAddBookAction } from "../../redux/order/orderSlice";
const BookPage = () => {
  let location = useLocation();

  let params = new URLSearchParams(location.search);
  const id = params?.get("id");
  // console.log(id);
  const [book, setBook] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(1);

  useEffect(() => {
    const fetchBookById = async () => {
      setIsLoading(true);
      const res = await getBookById(id);
      if (res && res.data) {
        let dataBook = res.data;
        // console.log("databook ", dataBook);
        dataBook.items = getImages(dataBook);
        // console.log("databook after", dataBook);

        setBook(dataBook);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    fetchBookById();
  }, []);
  // console.log(book);

  const images = book?.items ?? [];

  const getImages = (item) => {
    // console.log("getimages", item);
    const images = [];
    if (item.thumbnail) {
      images.push({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          item.thumbnail
        }`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          item.thumbnail
        }`,
      });
    }
    if (item.slider) {
      item?.slider?.map((s) => {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${s}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${s}`,
        });
      });
    }
    return images;
  };
  // console.log(book);
  const dispatch = useDispatch();
  const handleAddToCart = (quantity, detailBook) => {
    // console.log("handleAddToCart ", detailBook);
    dispatch(
      doAddBookAction({ quantity, detail: detailBook, _id: detailBook._id })
    );
  };

  const handleChangeButton = (type) => {
    if (type === "MINUS") {
      setCurrentQuantity(currentQuantity - 1);
    }

    if (type === "PLUS") {
      if (currentQuantity === +book.quantity) return;
      setCurrentQuantity(currentQuantity + 1);
    }
  };

  const handleChangeInput = (value) => {
    if (!isNaN(value)) {
      if (+value > 0 && +value < book.quantity) {
        setCurrentQuantity(+value);
      }
    }
  };
  return (
    <>
      <div className="bookpage">
        <div className="container">
          {isLoading ? (
            <BookLoader />
          ) : (
            <Row gutter={[40, 20]}>
              <Col span={12}>
                <ImageGallery
                  items={images}
                  showPlayButton={false}
                  slideOnThumbnailOver={true}
                  renderLeftNav={() => <></>}
                  renderRightNav={() => <></>}
                />
              </Col>
              <Col span={12}>
                <div className="author">Tác giả : {book.author}</div>
                <div className="name">{book.mainText}</div>

                <div className="rate">
                  <Rate value={5}></Rate>
                </div>

                <div className="sold">Đã bán : {book.quantity} sản phẩm</div>

                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(book.price)}
                </div>

                <div className="text">Vận chuyển : Miễn phí vận chuyển</div>
                <div className="quantity">
                  <div className="text-quantity">Số lượng </div>
                  <button
                    className="btn-quantity"
                    onClick={() => handleChangeButton("MINUS")}
                  >
                    -
                  </button>
                  <input
                    onChange={(event) => handleChangeInput(event.target.value)}
                    value={currentQuantity}
                  />
                  <button
                    className="btn-quantity"
                    onClick={() => handleChangeButton("PLUS")}
                  >
                    +
                  </button>
                </div>
                <div className="btn">
                  <button
                    className="left"
                    onClick={() => handleAddToCart(currentQuantity, book)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                  <button className="right"> Mua ngay</button>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </>
  );
};

export default BookPage;
