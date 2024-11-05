import { useLocation } from "react-router-dom";

const BookPage = () => {
  let location = useLocation();

  let params = new URLSearchParams(location.search);
  const id = params?.get("id");
  console.log(id);
  return <>BookPage</>;
};

export default BookPage;
