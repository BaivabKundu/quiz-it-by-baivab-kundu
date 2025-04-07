import { createConsumer } from "@rails/actioncable";
import { getFromLocalStorage } from "utils/storage";

const buildWebsocketURL = () => {
  const authToken = getFromLocalStorage("authToken");
  const email = getFromLocalStorage("authEmail");

  return encodeURI(`/cable?auth_token=${authToken}&email=${email}`);
};

export default () => createConsumer(buildWebsocketURL());
