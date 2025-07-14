export const auth = {
  isAuthenticated: false,
  login(callback) {
    auth.isAuthenticated = true;
    setTimeout(callback, 100); // simulate async
  },
  logout(callback) {
    auth.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};
