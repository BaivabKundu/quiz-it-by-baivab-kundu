const setToLocalStorage = ({ authToken, email, userId, userName }) => {
  localStorage.setItem("authToken", JSON.stringify(authToken));
  localStorage.setItem("authEmail", JSON.stringify(email));
  localStorage.setItem("authUserId", JSON.stringify(userId));
  localStorage.setItem("authUserName", JSON.stringify(userName));
};

const getFromLocalStorage = key => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

const setPublicUserToLocalStorage = userId => {
  localStorage.setItem("publicUser", JSON.stringify(userId));
};

const getPublicUserFromLocalStorage = () => getFromLocalStorage("publicUser");

export {
  setToLocalStorage,
  getFromLocalStorage,
  setPublicUserToLocalStorage,
  getPublicUserFromLocalStorage,
};
