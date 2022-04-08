import { Suspense } from "react";
import { fetchProfileData } from "../src/fakeApi";
const resource = fetchProfileData();

function Profile() {
  const data = resource.posts.read();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default function Example() {
  return (
    <Suspense fallback={<div>Loading dan1...</div>}>
      <Profile />
    </Suspense>
  );
}
