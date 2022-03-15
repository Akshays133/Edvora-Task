import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios'

const StoreContext = React.createContext();

export const useStore = () => useContext( StoreContext );



function StoreProvider({ children }) {
  const [user, setUser] = useState({});
  const [ride, setRide] = useState([]);
  const [filters, setFilters] = useState({ state: "", city: "" });
  const [status, setStatus] = useState("");

  // Fetching Date
  useEffect(() => {
    (async function () {
      await axios("https://assessment.api.vweb.app/user").then((res) => {
        //   console.log(res.data)
        setUser(res.data);
      });
    })();
    (async function () {
      await axios("https://assessment.api.vweb.app/rides").then((res) => {
        //   console.log(res.data)
        setRide(res.data);
      });
    })();
  }, [setUser, setRide]);

  //////////////////////////////////
  //////////////////////////////////
  ////////// collect unique state& city //////////
  /////////////////////////////////
  ////////////////////////////////
  
  const allStates = ride && ride.map((item) => {
    return item.state;
  });
  const allCities = ride && ride.map((item) => {
    return item.city;
  });
  const states = [...new Set(allStates)];
  const cities = [...new Set(allCities)];

  //////////////////////////////////
  //////////////////////////////////
  ////////// Hnadle Rides //////////
  /////////////////////////////////
  ////////////////////////////////

  /**
   * handle up coming rides
   * //////////////////////
   *
   * selecting all up coming rides
   * apply the Filter by:
   *  --- state
   *  --- city
   */

  function selectUpcomingRides() {
    const date = new Date();
    const now = date.getTime();

    return ride.filter((obj) => {
      const filterState = filters.state
        ? obj.state === filters.state
        : !filters.state;
      const filterCity = filters.city
        ? obj.city === filters.city
        : !filters.city;

      return new Date(obj.date).getTime() >= now && filterState && filterCity;
    });
  }

  /**
   * handle past rides
   * //////////////////////
   *
   * selecting all past rides
   * apply the Filter by:
   *  --- state
   *  --- city
   */
  function selectPastRides() {
    const date = new Date();
    const now = date.getTime();

    return ride.filter((obj) => {
      const filterState = filters.state
        ? obj.state === filters.state
        : !filters.state;
      const filterCity = filters.city
        ? obj.city === filters.city
        : !filters.city;

      return new Date(obj.date).getTime() < now && filterState && filterCity;
    });
  }

  /**
   * handling ( All Rides )
   * //////////////////////
   *
   * Selecting All rides
   * Apply the Filter by:
   *  --- state
   *  --- city
   */

  function selectAllRides() {
    return ride.filter((obj) => {
      const filterState = filters.state
        ? obj.state === filters.state
        : !filters.state;
      const filterCity = filters.city
        ? obj.city === filters.city
        : !filters.city;

      return filterState && filterCity;
    });
  }

  /**
   * handling rides
   * //////////////////////
   *
   * return Ride by selected ( status ) // upcoming, past and "" ( for all rides )
   * Apply the Filter by:
   *  --- state
   *  --- city
   */

  const getRides = () => {
    switch (status) {
      case "upcoming":
        return selectUpcomingRides();

      case "past":
        return selectPastRides();

      default:
        return selectAllRides();
    }
  };

  /*
        /////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////
        ////////// handling status State and Filter State //////////
        /////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////
    */

  const handleStatus = (state) => {
    setStatus(state);
  };

  const handleFilters = (obj) => {
    setFilters(obj);
  };

  const value = {
    handleStatus,
    handleFilters,
    selectUpcomingRides,
    selectPastRides,
    getRides,
    filters,
    status,
    ride,
    user,
    states,
    cities,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export default StoreProvider;