import { useEffect, useState } from "react";

function CityDetailFallback() {
  return <div>Loading (CityDetail)</div>;
}

function CityDetail({ selectedCityId }) {
  const [city, setCity] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchItemJSON() {
      setIsLoading(true);
      const response = await fetch(
        `https://airquality.peterkellner.net/api/data/pm25CurrentCityLastHours?cityId=${selectedCityId}`
      );
      setIsLoading(false);
      const city = await response.json();
      setCity(city);
    }
    if (selectedCityId) {
      fetchItemJSON();
    }
  }, [selectedCityId]);

  return isLoading ? (
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
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchItemsJSON() {
      setIsLoading(true);
      setSelectedCityId(undefined);
      const response = await fetch(
        "https://airquality.peterkellner.net/api/data/cities?count=3"
      );
      const cities = await response.json();
      setIsLoading(false);
      setCities(cities);
      setSelectedCityId(cities[0].id);
    }
    fetchItemsJSON();
  }, []);

  return isLoading ? (
    <CityListFallback />
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
            <b>CITY DETAIL (TOP ROW SELECTED AUTOMATICALLY) {selectedCityId}</b>
            <hr />
            <CityDetail selectedCityId={selectedCityId} />
          </div>
        </div>
      </div>
    </div>
  );
}
