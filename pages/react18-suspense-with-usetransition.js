import { Suspense, useEffect, useState, useTransition } from "react";
import useSwr from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function CityDetailFallback() {
  return <div>Loading (CityDetail)</div>;
}

function CityDetail({ selectedCityId }) {
  function CityDetailUI({ selectedCityId }) {
    const { data: city } = useSwr(
      selectedCityId
        ? `https://airquality.peterkellner.net/api/data/pm25CurrentCityLastHours?cityId=${selectedCityId}`
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

function CityList({ setSelectedCityId, setSelectedCityIdTemp }) {
  function CityListUI({ setSelectedCityId, setSelectedCityIdTemp }) {
    const { data: cities } = useSwr(
      "https://airquality.peterkellner.net/api/data/cities?count=3",
      fetcher,
      {
        suspense: true,
      }
    );

    const [isPending, startTransition] = useTransition();

    // useEffect(() => {
    //   if (cities && cities.length > 0) {
    //     setSelectedCityIdTemp(cities[0].id);
    //     startTransition(() => {
    //       setSelectedCityId(cities[0].id);
    //     });
    //   }
    // }, [isPending]);

    return (
      <div className="col-3">
        {cities.map((city) => {
          return (
            <div key={city.id}>
              <button
                onClick={(e) => {
                  setSelectedCityIdTemp(city.id);
                  startTransition(() => {
                    setSelectedCityId(city.id);
                  });
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
    <Suspense fallback={<CityListFallback />} >
      <CityListUI
        setSelectedCityId={setSelectedCityId}
        setSelectedCityIdTemp={setSelectedCityIdTemp}
      />
    </Suspense>
  );
}

export default function IndexPage() {
  const [selectedCityId, setSelectedCityId] = useState();
  const [selectedCityIdTemp, setSelectedCityIdTemp] = useState();

  return (
    <div className="container">
      <a href="/">Site Root</a>
      <hr />
      <div className="row">
        <div className="col-3">
          <b>CITY LIST</b>
          <hr />
          <CityList
            setSelectedCityId={setSelectedCityId}
            setSelectedCityIdTemp={setSelectedCityIdTemp}
          />
        </div>
        {/*<div className="col-9">*/}
        {/*  <div>*/}
        {/*    <b>CITY DETAIL (TOP ROW SELECTED AUTOMATICALLY)</b>*/}
        {/*    <hr />*/}
        {/*    <CityDetail*/}
        {/*      selectedCityId={selectedCityId}*/}
        {/*      selectedCityIdTemp={selectedCityIdTemp}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
