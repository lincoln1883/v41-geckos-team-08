import React, { useState, useRef } from 'react';
import DatePicker from 'react-date-picker';
import { Button } from './Button';
import Loading from './Loading';
import LandingImage from './../assets/images/drillBits.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { createJob, updateJob } from '../Redux/Actions/jobActions';
import { getAPI } from '../Utils/Axios';
import SortAndSearch from './SortAndSearch';
import { store } from '../Redux/Store';
import { useLocation, useNavigate } from 'react-router-dom';

export const JobForm = () => {
  const [date, changeDate] = useState(new Date());

  const initialState = {
    trade_uuid: '',
    city_uuid: '',
    description: '',
    low_price: 1,
    high_price: 1,
    expiration_date: date.toISOString().split('T')[0],
  };

  const [newJob, setNewJob] = useState(initialState);
  const [countries, setCountries] = useState([]);
  const [trades, setTrades] = useState([]);

  const {
    description,
    low_price,
    high_price
  } = newJob;

  const handleChange = (e) =>
    setNewJob({
      ...newJob,
      [e.target.name]:
        e.target.type === 'number' ? parseInt(e.target.value) : e.target.value,
    });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    (async () => {
      const { data: _countries } = await getAPI(`locations`, userInfo.token);
      setCountries(_countries.data);
      const { data: _trades } = await getAPI('trades', userInfo.token);
      const tradesArr = _trades.data
        .filter((trade) => trade.description.substring(0, 2) !== '{{')
        .sort((a, b) => a.description.localeCompare(b.description))
        .map((trade) => ({
          ...trade,
          description:
            trade.description.charAt(0).toUpperCase() +
            trade.description.slice(1).toLowerCase(),
        }));
      setTrades(tradesArr);
    })();
  }, [userInfo.token]);

  const [loading, setLoading] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const location = useLocation();
  const jobUUID = location.search.slice(5) || '';

  useEffect(() => {
    if (location.search === '') {
      setLoading(false);
      return;
    }
    if (trades.length === 0) return;
    setShowUpdate(true);
    (async () => {
      try {
        const { data: res } = await getAPI(`jobs/${jobUUID}`, userInfo.token);
        const data = res.data;
        const [country] = countries.filter(_country => _country.uuid === data.city.country_uuid);
        setSelectedCountry(country.uuid);
        setCityInput(data.city.name);
        setSelectedTrade(data.trade.uuid);
        changeDate(new Date(data.expiration_date));
        setNewJob({
          ...newJob,
          city_uuid: data.city.uuid,
          trade_uuid: data.trade.uuid,
          description: data.description,
          low_price: data.low_price,
          high_price: data.high_price,
          expiration_date: data.expiration_date.split('T')[0]
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [trades]);

  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    console.log(newJob);
  }, [newJob]);

  const [showCityForUpdate, setShowCityForUpdate] = useState(true);

  useEffect(() => {
    if (selectedCountry === '' && cities.length > 0) {
      setCityInput('');
      setCities([]);
      setFilteredCities([]);
    }
    if (selectedCountry !== '') {
      if (!showCityForUpdate) setCityInput('');
      (async () => {
        const { data: _cities } = await getAPI(
          `locations/${selectedCountry}`,
          userInfo.token
        );
        setCities(_cities.data);
      })();
      if (showCityForUpdate) setShowCityForUpdate(false);
    }
  }, [selectedCountry, userInfo.token]);

  const [cities, setCities] = useState([]);

  useEffect(() => {
    setNewJob({
      ...newJob,
      expiration_date: date.toISOString().split('T')[0],
    });
  }, [date]);

  const [cityInput, setCityInput] = useState('');

  const [filteredCities, setFilteredCities] = useState([]);
  const [cityInputToggled, setCityInputToggled] = useState(false);

  useEffect(() => {
    if (cityInput === '') {
      setFilteredCities([]);
      return;
    }
    const _cities = cities
      .filter((city) =>
        city.name.toLowerCase().includes(cityInput.toLowerCase())
      )
      .slice(0, 5);
    if (!cityInputToggled) setFilteredCities(_cities);
    if (cityInputToggled) setCityInputToggled(false);
  }, [cityInput]);

  const [selectedTrade, setSelectedTrade] = useState('');

  useEffect(() => {
    setNewJob({
      ...newJob,
      trade_uuid: selectedTrade,
    });
  }, [selectedTrade]);

  const cityInputHandler = (city) => {
    setNewJob({
      ...newJob,
      city_uuid: city.uuid,
    });
    setFilteredCities([]);
    setCityInputToggled(true);
    setCityInput(city.name);
  };

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newJob);
    if (showUpdate) {
      dispatch(updateJob(newJob, jobUUID, userInfo.token));
    } else {
      dispatch(createJob(newJob, userInfo.token));
    }
    navigate(`/user/${auth.data.uuid}`);
  };

  return (
    <>
      {loading && <Loading />}
      {!loading &&
        <div className='flex flex-wrap lg:h-full'>        
          <div className='w-full lg:w-1/2 bg-white p-8 m-0'>
            <h1 className='block w-full text-center text-black text-3xl tracking-tight font-bold mb-6'>
              {showUpdate ? 'Update' : 'New'} Job
            </h1>
            <form className='flex flex-col justify-center' onSubmit={handleSubmit}>
              <div className='flex flex-col mb-4'>
                <label
                  className='mb-2 font-bold text-lg text-black'
                  htmlFor='countries'
                >
                  Countries
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className='cursor-pointer'
                >
                  <option default value=''>
                    Select a country
                  </option>
                  {countries.map((country) => {
                    return (
                      <option key={country.uuid} value={country.uuid}>
                        {country.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='flex flex-col mb-4'>
                <label
                  className={`mb-2 font-bold text-lg text-black ${
                    selectedCountry ? 'text-opacity-100' : 'text-opacity-20'
                  }`}
                  htmlFor='cities'
                >
                  Cities
                </label>
                <input
                  className={`${selectedCountry ? 'opacity-100' : 'opacity-20'}`}
                  type='search'
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  disabled={selectedCountry === ''}
                />
                <ul>
                  {filteredCities.map((city) => (
                    <li
                      className='cursor-pointer hover:opacity-60 text-black'
                      key={city.uuid}
                      onClick={() => cityInputHandler(city)}
                    >
                      {city.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='flex flex-col mb-4'>
                <label
                  className='mb-2 font-bold text-lg text-black'
                  htmlFor='last_name'
                >
                  Trade
                </label>
                <select
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className='cursor-pointer'
                >
                  <option default value=''>
                    Select a trade
                  </option>
                  {trades.map((trade) => {
                    return (
                      <option key={trade.uuid} value={trade.uuid}>
                        {trade.description}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='flex flex-col mb-4'>
                <label
                  className='mb-2 font-bold text-lg text-black'
                  htmlFor='description'
                >
                  Description
                </label>
                <textarea
                  className='border py-2 px-3 text-black rounded'
                  type='text'
                  name='description'
                  id='description'
                  value={description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='flex flex-col mb-4'>
                <label
                  className='mb-2 font-bold text-lg text-black'
                  htmlFor='date'
                >
                  I Need this Done by
                </label>
                <div>
                  <DatePicker
                    clearIcon={null}
                    className='bg-white'
                    value={date}
                    onChange={changeDate}
                    required
                  />
                </div>
              </div>
              {/* prices are converted from numbers to strings when changed */}
              <div className='flex flex-col mb-4'>
                <label
                  className='mb-2 font-bold text-lg text-black'
                  htmlFor='low_price'
                >
                  Low Price
                </label>
                <input
                  type='number'
                  min={1}
                  required
                  name='low_price'
                  id='low_price'
                  value={low_price}
                  onChange={handleChange}
                />
                <label
                  className='my-2 font-bold text-lg text-black'
                  htmlFor='high_price'
                >
                  High Price
                </label>
                <input
                  type='number'
                  min={1}
                  required
                  name='high_price'
                  id='high_price'
                  value={high_price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Button
                  type='submit'
                  value='submit'
                  backgroundColor='tertiary-100'
                  name='Post'
                  disabled={
                    newJob.trade_uuid === '' ||
                    newJob.city_uuid === '' ||
                    description === '' ||
                    isNaN(low_price) ||
                    isNaN(high_price) ||
                    high_price < low_price
                  }
                />
              </div>
            </form>
          </div>
          <div className='hidden grow-0 shrink-0 basis-90 lg:flex lg:w-6/12 xl:w-6/12 '>
            <img
              src={LandingImage}
              alt='Trendy Pants and Shoes'
              className='w-full h-screen'
            />
          </div>
        </div>       
      }
    </>
  );
};
