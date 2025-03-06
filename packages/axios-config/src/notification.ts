import { toast } from "react-toastify";

function notification(
  message: string,
  type: "info" | "success" | "warning" | "error" = "info",
) {
  return toast[type](message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

export { notification };
