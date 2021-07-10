import React, { Suspense, lazy } from "react";
import Loader from "components/common/loading";

const loaders = <Loader />;

export default function(importComponent) {
  const Component = lazy(importComponent);
  return props => (
    <Suspense fallback={loaders}>
      <Component {...props} />
    </Suspense>
  );
}
