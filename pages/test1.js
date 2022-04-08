// https://codesandbox.io/s/suspense-timeout-example-4g7rh?file=/src/App.tsx:42-490
// https://javascript.plainenglish.io/react-18-suspense-minimal-example-775f786ba24

import { Suspense } from "react";

export default function App() {
  let fullfilled = false;
  let promise = null;

  const useTimeout = (ms) => {
    if (!fullfilled) {
      throw (promise ||= new Promise((res) => {
        setTimeout(() => {
          fullfilled = true;
          res();
        }, ms);
      }));
    }
  };

  const Main = () => {
    useTimeout(4000);
    return <div>Loaded</div>;
  };

  console.log("before return");

  return (
    <Suspense fallback={<div>Loading</div>}>
      <Main />
    </Suspense>
  );
}
