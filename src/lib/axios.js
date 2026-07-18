import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('authTokenBasma');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('authTokenBasma');
      // window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error("ليس لديك صلاحية للوصول لهذا المورد");
    } else if (error.response?.status >= 500) {
      toast.error("حدث خطأ في الخادم، يرجى المحاولة لاحقاً");
    } else if (error.code === "ECONNABORTED") {
      toast.error("انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى");
    } else if (!error.response) {
      toast.error("تعذر الاتصال بالخادم، تحقق من اتصال الإنترنت");
    }
    return Promise.reject(error);
  }
);

export default api;