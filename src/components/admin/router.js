import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "hoc/AsyncFunc";

const routes = [
  {
    path: "/template",
    component: asyncComponent(() => import("components/template"))
  },
  {
    path: "/censorship",
    component: asyncComponent(() => import("components/censorship"))
  }
];

function storeSelector({ user }) {
  return {
    role: user.user.role
  };
}

function AppRouter() {
  const { role } = useSelector(storeSelector, shallowEqual);
  const routeComponents = [];
  routes.forEach(({ path, exact, component }) => {
    if (role === "admin") {
      routeComponents.push(
        <Route exact={exact === false ? false : true} key={path} path={path} component={component} />
      );
    }
  });
  return (
    <Switch>
      {routeComponents}
    </Switch>
  );
}

export default AppRouter;