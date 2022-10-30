import React from 'react';
import { LandingTop } from '../Components/LandingTop';
import { NavBar } from '../Components/NavBar';
import { LandingBottom } from './../Components/LandingBottom';
import { Footer } from './../Components/Footer';
import LandingImage from './../assets/images/Drill.jpg';

export const LandingPage = () => {
  return (
    <div className='bg-white  rounded-sm border-none flex flex-col'>
      <NavBar />
  
     
                <LandingTop />
      

       
          <LandingBottom />
      <Footer />
    </div>
  );
};
