import React from 'react';
import Preloader from "../components/common/Preloader/Preloader";

export const withSuspense = (Component) => (props) => {
    return (
      <React.Suspense fallback={<Preloader height={'490px'}/>}>
          <Component {...props}/>
      </React.Suspense>
    );
};