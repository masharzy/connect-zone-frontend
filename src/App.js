import "./App.css";
import Home from "./Pages/Home/Home";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./Component/Login";
import Register from "./Component/Register";
import RequireAuth from "./Pages/Auth/RequireAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./Pages/Profile/Profile";
import FriendRequests from "./Pages/Profile/FriendRequests";
import Edit from "./Pages/Profile/Edit";
import ConnectedPeople from "./Pages/ConnectedPeople/ConnectedPeople";

function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/user/:email" element={<Profile />} />
        <Route
          path="/user/:email/requests"
          element={
            <RequireAuth>
              <FriendRequests />
            </RequireAuth>
          }
        />
        <Route
          path="/user/:email/edit"
          element={
            <RequireAuth>
              <Edit />
            </RequireAuth>
          }
        />
        <Route
          path="/user/friends"
          element={
            <RequireAuth>
              <ConnectedPeople />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={"dark"}
      />
    </div>
  );
}

export default App;
