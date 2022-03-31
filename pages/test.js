import { Suspense } from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Profile() {
  const { data } = useSWR(
    //"https://jsonplaceholder.typicode.com/todos/1",
    "https://airquality.peterkellner.net/api/data/cities?count=3",
    fetcher,
    { suspense: true }
  );
  return <div>{JSON.stringify(data)}</div>;
}

function Fb() {
  console.log("Fb")
  return <div>Fb loading...</div>
}

function App() {
  return (
    <Suspense fallback={<Fb />}>
      <Profile />
    </Suspense>
  );
}

export default App;
