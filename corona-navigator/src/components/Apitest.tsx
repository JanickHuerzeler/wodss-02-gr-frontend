import axios from "axios";
import "./Apitest.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helloworldtype, HelloworldtypeMunicipality } from "../api";

const baseApiPath = "http://localhost:5001";
const helloWorldPath = "/helloworld";

const headers = {
  headers: { "Content-Type": "application/json; charset=utf-8" },
};

const Apitest = () => {
  // https://medium.com/swlh/interacting-with-restful-apis-using-typescript-react-hooks-and-axios-part-1-af52920ae3e4

  const [helloworld, setHelloWorld] = useState<Helloworldtype>({});

  const [loading, setLoading]: [
    boolean,
    (loading: boolean) => void
  ] = useState<boolean>(true);
  const [error, setError]: [string, (error: string) => void] = useState("");

  useEffect(() => {
    axios
      .get<Helloworldtype[]>(baseApiPath + helloWorldPath, {
        headers: headers.headers,
      })
      .then((response) => {
        setHelloWorld(response.data[0]);
        setLoading(false);
      })
      .catch((ex) => {
        const error =
          ex.response.status === 404
            ? "Resource not found"
            : "Unexpected Error";
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className='apitest'>
      <h1>ApiTest Request</h1>
      <h3>BFSNR: {helloworld.municipality?.bfs_nr}</h3>

      <span>Area: {helloworld.municipality?.area}</span><br/>
      <span>Incidence: {helloworld.municipality?.incidence}</span><br/>
      <span>Population: {helloworld.municipality?.population}</span><br/>
      <div>
        Polygons:
        
          {helloworld.polygon?.flat().map((polygon, i) => (
            <p key={i}>{polygon.toString()}</p>
          ))}
        
      </div>
      {error && <p className='error'>{error}</p>}
    </div>
  );
};
export default Apitest;
