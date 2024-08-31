import React, { useCallback, useEffect } from "react";
import Components from "./components";
import Sidebar from "./components/Sidebar/Sidebar";
import AdminNavbar from "./components/Navbars/AdminNavbar";
import Footer from "./components/Footer/Footer";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import { getRootByRole } from "./Redux/rootBaseReduce";
import { verification } from "./Redux/usersReduce";
import { useDispatch, useSelector } from "react-redux";

function RootBase() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { users } = useSelector((state) => state.users);
  const [entities, setEntities] = React.useState([]);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (
        prop.role.includes(users[0].data.user.id_role) ||
        prop.role.includes(20)
      ) {
        var component = React.createElement(
          Components[prop.componentStr],
          { obj: users[0].data },
          null
        );
        return <Route path={prop.path} key={key} render={() => component} />;
      }
      return null;
    });
  };
  //verif token
  const getUser = useCallback(
    async (user) => {
      if (user) {
        var root = await dispatch(getRootByRole(user[0].data.user.id_role));
        var resRoot = await root.payload;
        setEntities(resRoot);
      }
    },
    [dispatch]
  );

  //verif token
  const verifToken = useCallback(
    async (data) => {
      var response = await dispatch(verification());
      if (response.payload === false) {
        localStorage.clear();
        window.location.replace("/login");
      } else {
        getUser(data);
      }
    },
    [dispatch, getUser]
  );

  useEffect(() => {
    if (users) verifToken(users);
    /* if (location.pathname === "/") {
      window.location.replace("/profile");
    } */
    /* getUser(users); */
  }, [users, verifToken]);

  return (
    <>
      {users && entities.length > 0 ? (
        <div className="wrapper">
          <Sidebar users={users[0].data} routes={entities} />
          <div className="main-panel">
            <AdminNavbar users={users[0].data} />
            <div className="content">
              <Switch>
                {entities.length > 0 ? getRoutes(entities) : ""}
                <Redirect from="/" to="/profile" />
                {/* <Route path="/" element={<Navigate replace to="/profile" />} /> */}
              </Switch>
            </div>
            <Footer />
            <div
              className="close-layer"
              onClick={() =>
                document.documentElement.classList.toggle("nav-open")
              }
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default RootBase;
