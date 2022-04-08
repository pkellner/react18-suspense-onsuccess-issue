// $$$ THIS DOES NOT LOAD THE DETAIL PAGE AS EXPECTED, AS THERE IS NO ONSUCCESS EVENT TO MAKE IT LOAD
//     HOWEVER, THERE IS ANOTHER ISSUE, UNRELATED TO ONSUCCESS THAT THIS PAGES CAUSES AN ODD HTML MISMATCH RENERING PROBLEM
//     I CREATED AN ISSUE ON SWR REPO HERE: https://github.com/vercel/swr/issues/1905

import { Suspense, useEffect, useState } from "react";
import useSwr from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function CityDetailFallback() {
  return <div>Loading (CityDetail)</div>;
}

function CityDetail({ selectedCityId }) {
  function CityDetailUI({ selectedCityId }) {
    const { data: city } = useSwr(
      selectedCityId
        ? `/api/city/${selectedCityId}`
        : null,
      fetcher,
      {
        suspense: true,
      }
    );
    return (
      <div className="row">
        <div className="col-9">
          <div>{JSON.stringify(city)} </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<CityDetailFallback />}>
      <CityDetailUI selectedCityId={selectedCityId}></CityDetailUI>
    </Suspense>
  );
}

function CityListFallback() {
  return <div>Loading (CityList)</div>;
}

function CityList({ setSelectedCityIdFn }) {
  function CityListUI({ setSelectedCityIdFn }) {
    const { data: cities } = useSwr(
      "/api/city",
      fetcher,
      {
        suspense: true,
        // onSuccess does not work with Suspense (which is the problem I'm showing in this demo)
        // onSuccess: (data) => {
        //   setSelectedCityIdFn(data[0].id);
        // },
      }
    );

    return (
      <div className="col-3">
        {cities.map((city) => {
          return (
            <div key={city.id}>
              <button
                onClick={() => {
                  setSelectedCityIdFn(city.id);
                }}
              >
                {city.city}
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Suspense fallback={CityListFallback}>
      <CityListUI setSelectedCityIdFn={setSelectedCityIdFn} />
    </Suspense>
  );
}

export default function IndexPage() {
  const [selectedCityId, setSelectedCityId] = useState();

  return (
    <div className="container">
      <a href="/">Site Root</a>
      <hr />
      <div className="row">
        <div className="col-3">
          <b>CITY LIST</b>
          <hr />
          <CityList
            selectedCityId={selectedCityId}
            setSelectedCityIdFn={(id) => {
              setSelectedCityId(id);
            }}
          />
        </div>
        {/*<div className="col-9">*/}
        {/*  <div>*/}
        {/*    <b>CITY DETAIL (TOP ROW SELECTED AUTOMATICALLY)</b>*/}
        {/*    <hr />*/}
        {/*    <CityDetail selectedCityId={selectedCityId} />*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
