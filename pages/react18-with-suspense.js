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

function CityList(props) {
  //
  function CityListUI({
    selectedCityId,
    setSelectedCityId,
    isPending,
    startTransition,
  }) {
    //
    const { data: cities } = useSwr(
      "https://airquality.peterkellner.net/api/data/cities?count=3",
      fetcher,
      {
        suspense: true,
      }
    );
   
    useEffect(() => {
      if (cities && cities?.length > 0) {
        setSelectedCityId(cities[0].id);
      }
    },[]);

    return (
      <div className="col-3">
        {cities.map((city) => {
          return (
            <div key={city.id}>
              <button
                onClick={(e) => {
                  setSelectedCityId(undefined);
                  startTransition(() => {
                    setSelectedCityId(city.id);
                  });
                }}
              >
                {city.city} {isPending ? "retrieving..." : ""}
              </button>
            </div>
          );
        })}
      </div>
    );
  }

 

  return (
    <Suspense fallback={<CityListFallback />}>
      <CityListUI
        {...props}
      />
    </Suspense>
  );
}

export default function IndexPage() {
  const [selectedCityId, setSelectedCityId] = useState();
  
  const [isPending, startTransition] = useTransition();
  
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
            selectedCityId={selectedCityId}
            isPendng={isPending}
            startTransition={startTransition}
          />
        </div>
        <div className="col-9">
          <div>
            <b>CITY DETAIL (TOP ROW SELECTED AUTOMATICALLY)</b>
            <hr />
            <CityDetail selectedCityId={selectedCityId} />
          </div>
        </div>
      </div>
    </div>
  );
}
