
import axios from "../utils/axios-customize";

export const postRegister = (fullName, email, password, phone) => {
  return axios.post('/api/v1/user/register', { fullName, email, password, phone });
}

export const postLogin = (username, password) => {
  return axios.post('/api/v1/auth/login', { username, password });
}

export const getAccount = () => {
  return axios.get('/api/v1/auth/account');
}

export const postLogout = () => {
  return axios.post('/api/v1/auth/logout');
}

export const getListUser = (param) => {
  return axios.get(`/api/v1/user${param}`);
}

export const postCreateUser = (data) => {
  return axios.post(`/api/v1/user`, data);
}

export const putUpdateUser = (data) => {
  return axios.put(`/api/v1/user`, data);
}

export const postListUser = (data) => {
  return axios.post(`/api/v1/user/bulk-create`, data);
}

export const deleteUser = (id) => {
  return axios.delete(`/api/v1/user/${id}`);
}

export const getListBook = (param) => {
  return axios.get(`/api/v1/book${param}`);
}

export const postCreateBook = (thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category) => {
  return axios.post(`/api/v1/book`, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    sold,
    quantity,
    category
  });
}

export const putUpdateBook = (_id, thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category) => {
  return axios.put(`/api/v1/book/${_id}`, {

    thumbnail,
    slider,
    mainText,
    author,
    price,
    sold,
    quantity,
    category
  });
}


export const deleteBook = (id) => {
  return axios.delete(`/api/v1/book/${id}`);
}

export const getListCategory = () => {
  return axios.get(`/api/v1/database/category`);
}

export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileImg', fileImg);
  return axios({
    method: 'post',
    url: '/api/v1/file/upload',
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book"
    },
  });
}


export const getBookById = (id) => {
  return axios.get(`/api/v1/book/${id}`);
}

export const postOrder = (data) => {

  return axios.post(`/api/v1/order`, { ...data });
}

export const callOrderHistory = () => {
  return axios.get('/api/v1/history');
}

export const callUpdateAvatar = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileImg', fileImg);
  return axios({
    method: 'post',
    url: '/api/v1/file/upload',
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar"
    },
  });
}

export const callUpdateUserInfo = (_id, phone, fullName, avatar) => {
  return axios.put(`/api/v1/user`, {
    _id, phone, fullName, avatar
  })
}

export const callUpdatePassword = (email, oldpass, newpass) => {
  return axios.post(`/api/v1/user/change-password`, {
    email, oldpass, newpass
  })
}


export const getListOrder = (param) => {
  return axios.get(`/api/v1/order${param}`);
}

export const callFetchDashboard = () => {
  return axios.get('/api/v1/database/dashboard')
}
