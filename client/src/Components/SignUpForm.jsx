import React from 'react'
import { Button } from './Button';
import LandingImage from './../assets/images/Drill.jpg';
import { Link } from "react-router-dom";
import { useState } from 'react';
import { signup } from '../Redux/Actions/authActions';
import { useDispatch } from 'react-redux';

export const SignUpForm = () => {

  const initialState = {
    first_name: '',
    last_name: '',
    trade: '',
    location: '',
    email: '',
    password: ''
  };

  const [userSignup, setUserSignup] = useState(initialState);

  const { first_name, last_name, trade, location, email, password } = userSignup;

  const handleChange = e => setUserSignup({
    ...userSignup,
    [e.target.name]: e.target.value
  });

  const dispatch = useDispatch();

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(signup(userSignup));
  }

  return (
    <div className='flex flex-wrap lg:h-full'>
        <div className='w-full lg:w-1/2 bg-white p-8 m-0'>
          <h1 className='block w-full text-center text-gray-800 text-2xl font-bold mb-6'>
            Register
          </h1>
          <form className='flex flex-col justify-center' action='/' method='POST' onSubmit={handleSubmit}>
            <div className='flex flex-col mb-4'>
              <label
                className='mb-2 font-bold text-lg text-black'
                htmlFor='first_name'
              >
                First Name
              </label>
              <input
                className='border py-2 px-3 text-black rounded'
                type='text'
                name='first_name'
                id='first_name'
                placeholder='First Name'
                value={first_name}
                onChange={handleChange}
              />
            </div>
            <div className='flex flex-col mb-4'>
              <label
                className='mb-2 font-bold text-lg text-black'
                htmlFor='last_name'
              >
                Last Name
              </label>
              <input
                className='border py-2 px-3 text-black rounded'
                type='text'
                name='last_name'
                id='last_name'
                placeholder='Last Name'
                value={last_name}
                onChange={handleChange}
              />
            </div>
            <div className='flex flex-col mb-4'>
              <label className='mb-2 font-bold text-lg text-black'  htmlFor='email'>
                Trade
              </label>
              <input
                className='border py-2 px-3 text-black rounded'
                type='text'
                name='trade'
                id='trade'
                placeholder='Trade'
                value={trade}
                onChange={handleChange}
              />
            </div>
            <div className='flex flex-col mb-4'>
              <label
                className='mb-2 font-bold text-lg text-black'
                htmlFor='location'
              >
                Location
              </label>
              <input
                className='border py-2 px-3 text-black rounded'
                type='text'
                name='location'
                id='location'
                placeholder='Location'
                value={location}
                onChange={handleChange}
              />
            </div>
            <div className='flex flex-col mb-4'>
              <label
                className='mb-2 font-bold text-lg text-black '
                htmlFor='email'
              >
                E-mail
              </label>
              <input
                className='border py-2 px-3 text-black rounded' 
                type='email'
                name='email'
                id='email'
                placeholder='Email'
                value={email}
                onChange={handleChange}
              />
            </div>
            <div className='flex flex-col mb-4'>
              <label
                className='mb-2 font-bold text-lg text-black '
                htmlFor='password'
              >
                Password
              </label>
              <input
                className='border py-2 px-3 text-black rounded'
                type='password'
                name='password'
                id='password'
                placeholder='Password'
                value={password}
                onChange={handleChange}
              />
            </div>
            <div className='mt-10 -ml-6'>
              <Button type='submit' value='submit' backgroundColor='primary-200' />
            </div>
          </form>
          <Link
            className='block w-full no-underline mt-4 text-sm text-black hover:text-secondary-300'
            to='/login'
          >
            Already have an account?
          </Link>
        </div>
      <div className='hidden grow-0 shrink-0 basis-90 lg:flex lg:w-6/12 xl:w-6/12'>
          <img
            src={LandingImage}
            alt='Trendy Pants and Shoes'
            className='w-full h-fit'
          />
      </div>
    </div>
  );
}
