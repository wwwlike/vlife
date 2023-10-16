import React, { ReactNode } from "react";
import { AuthProvider } from "@src/context/auth-context";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { modalReducer } from "@src/redux/modal";
export const AppProviders = ({ children }: { children: ReactNode }) => {
  const store = createStore(modalReducer);
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
};
