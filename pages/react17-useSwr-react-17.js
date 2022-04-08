import { useState } from "react";
import useSwr from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function CityDetail({ selectedCityId }) {
  const { data: city } = useSwr(
    `/api/city/${selectedCityId}`,
    fetcher
  );
  const isLoading = !city;

  return isLoading ? (
    <div>City Detail Loading...</div>
  ) : (
    <div className="row">
      <div className="col-9">
        <div>{JSON.stringify(city)} </div>
      </div>
    </div>
  );
}

function CityList({ setSelectedCityId }) {
  
  const { data: cities } = useSwr(
    "/api/city",
    fetcher,
    {
      onSuccess: (data) => {
        setSelectedCityId(data[0].id);
      },
    }
  );
  const isLoading = !cities;
  return isLoading ? (
    <div>Loading City List...</div>
  ) : (
    <div className="col-3">
      {cities.map((city) => {
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
      <a href="/">Site Root</a><hr/>
      <div className="row">
        <div className="col-3">
          <b>CITY LIST</b>
          <hr />
          <CityList
            selectedCityId={selectedCityId}
            setSelectedCityId={setSelectedCityId}
          />
        </div>
        <div className="col-9">
          <div>
            <b>CITY DETAIL</b>
            <hr />
            <CityDetail selectedCityId={selectedCityId} />
          </div>
        </div>
      </div>
    </div>
  );
}
