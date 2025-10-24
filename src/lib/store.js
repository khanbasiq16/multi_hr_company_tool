"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; 
import { persistReducer, persistStore } from "redux-persist";
import UserReducer from "../features/Slice/UserSlice";
import CompanyReducer from "../features/Slice/CompanySlice";
import DepartmentReducer from "../features/Slice/DepartmentSlice";
import EmployeeReducer from "../features/Slice/EmployeeSlice";
import ExpenseReducer from "../features/Slice/ExpenseSlice";
import ClientReducer from "../features/Slice/ClientSlice";
import InvoiceReducer from "../features/Slice/InvoiceSlice";
import IpwhiteReducer from "../features/Slice/IpwhiteSlice";
import CheckinReducer from "../features/Slice/CheckInSlice";
import CheckOutReducer from "../features/Slice/CheckOutSlice";
import StopwatchReducer from "../features/Slice/StopwatchSlice";
import TemplatesReducer from "../features/Slice/TemplateSlice";

const rootReducer = combineReducers({
  User: UserReducer,
  Company:CompanyReducer,
  Department:DepartmentReducer,
  Employee:EmployeeReducer,
  Expense:ExpenseReducer,
  Client:ClientReducer,
  Invoice:InvoiceReducer,
  Ipwhitelist:IpwhiteReducer,
  Checkin:CheckinReducer,
  Checkout:CheckOutReducer,
  Stopwatch:StopwatchReducer,
  Templates:TemplatesReducer
  
});


const persistConfig = {
  key: "root", 
  storage, 
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
  devTools: process.env.NODE_ENV !== "production",
});


export const persistor = persistStore(store);

export default store;
