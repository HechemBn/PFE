import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Redux/usersReduce";
import roleReducer from "./Redux/roleReduce";
import settingsReducer from "./Redux/settingsReduce";
import notificationReducer from "./Redux/notificationReduce";
import rootBaseReduce from "./Redux/rootBaseReduce";
export default configureStore({
  reducer: {
    users: usersReducer,
    role: roleReducer,
    settings: settingsReducer,
    notification: notificationReducer,
    rootBase: rootBaseReduce,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false,}),
});
