import { useEffect, useState } from "react";
import { GetCountries } from "react-country-state-city";
export default function Test() {
  const [countriesList, setCountriesList] = useState<string[]>([]);
  const [country, setCountry] = useState<string | null>(null);
  useEffect(() => {
    GetCountries().then((result) => {
      setCountriesList(result);
    });
  }, []);
  return (
    <div>
      <h3>Country</h3>
      <select onChange={(e) => setCountry(e.target.value)} value={country}>
        <option value={""}>-- Select Country --</option>
        {countriesList.map((_country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
}
