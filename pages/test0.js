import { Suspense } from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Profile() {
  const { data } = useSWR(
    "https://airquality.peterkellner.net/api/data/temperatureCurrentCity?cityId=5",
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
