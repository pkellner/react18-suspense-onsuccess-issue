import { useEffect, useState } from "react";
import useSwr from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function CityDetailFallback() {
  return <div>Loading (CityDetail)</div>;
}

function CityDetail({ selectedCityId }) {
  const { data: city } = useSwr(
    selectedCityId
      ? `https://airquality.peterkellner.net/api/data/pm25CurrentCityLastHours?cityId=${selectedCityId}`
      : null,
    fetcher,
    {
      suspense: false,
      onSuccess: (data, key, config) => {},
    }
  );

  return !city ? (
    <CityDetailFallback />
  ) : (
    <div className="row">
      <div className="col-9">
        <div>{JSON.stringify(city)} </div>
      </div>
    </div>
  );
}

function CityListFallback() {
  return <div>Loading (CityList)</div>;
}

function CityList({ setSelectedCityId }) {
  const { data: cities } = useSwr(
    "https://airquality.peterkellner.net/api/data/cities?count=3",
    fetcher,
    {
      suspense: false,
      onSuccess: (data) => {
        setSelectedCityId(data[0].id);
      },
    }
  );

  return !cities ? (
    <CityListFallback />
  ) : (
    <div className="col-3">
      {cities?.map((city) => {
        return (
          <div key={city.id}>
            <button
              onClick={() => {
                setSelectedCityId(city.id);
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
            setSelectedCityId={setSelectedCityId}
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
