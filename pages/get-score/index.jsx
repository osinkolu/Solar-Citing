import React from "react";
import { useState } from "react";
import useDownloader from "react-use-downloader";
import styles from "./contact.module.sass";
import Image from "next/image";

export default function SolarPanelForm(){

  const [lat, setLat] = useState(5.4905);
  const [lon, setLon] = useState(99.0521);
  const [fileNumber, setFileNumber] = useState(0);
  const [startDate, setStartDate] = useState(20220101);
  const [endDate, setEndDate] = useState(20220101);
  const [score, setScore] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formErrors, setFormErrors] = useState({
    lat: '',
    lon: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    } else {
      setFormErrors({
        lat: '',
        lon: '',
        startDate: '',
        endDate: '',
      });
    }

    // const requestBody = {
    //   lat,
    //   lon,
    //   file_number: fileNumber,
    //   start_date: startDate,
    //   end_date: endDate,
    // };

    const requestBody = {
      "lat":lat, 
      "lon":lon,
      "file_number":fileNumber,
      "start_date": startDate,
      "end_date": endDate
    };

    try {
      // Make request to scorex endpoint
      const scoreResponse = await fetch('https://solarpanelciting.azurewebsites.net/scorex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      console.log('Getting score')

      if (!scoreResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const scoreData = await scoreResponse.json();
      console.log(scoreData)
      setScore(scoreData);

      // Make request to imagex endpoint
      const imageResponse = await fetch('https://solarpanelciting.azurewebsites.net/imagex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Getting image')

      if (!imageResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const imageData = await imageResponse.blob();
      const imageUrl = URL.createObjectURL(imageData);
      console.log(imageUrl)
      setImageUrl(imageUrl);

      
      // fetch('https://solarpanelciting.azurewebsites.net/imagex', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(requestBody)
      // })
      //   .then(response => {
      //     console.log('Getting image')

      //     console.log(response)
      //     if (!response.ok) {
      //       throw new Error('Network response was not ok');
      //     }
      //     return response.blob();
      //   })
      //   .then(blob => {
      //     const url = URL.createObjectURL(blob);
      //     const img = document.createElement('img');
      //     img.src = url;
      //     document.body.appendChild(img);
      //   })
      //   .catch(error => {
      //     console.error('There was a problem with the fetch operation:', error);
      //   });

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!lat) {
      errors.lat = 'Latitude is required';
    } else if (isNaN(Number(lat)) || Number(lat) < -90 || Number(lat) > 90) {
      errors.lat = 'Latitude must be a number between -90 and 90';
    }

    if (!lon) {
      errors.lon = 'Longitude is required';
    } else if (isNaN(Number(lon)) || Number(lon) < -180 || Number(lon) > 180) {
      errors.lon = 'Longitude must be a number between -180 and 180';
    }

    if (!fileNumber && fileNumber != 0) {
      errors.fileNumber = 'File number is required';
    } else if (isNaN(Number(fileNumber))) {
      errors.fileNumber = 'File number must be a number';
    }

    if (!startDate) {
      errors.startDate = 'Start date is required';
    } else if (!/^\d{8}$/.test(startDate)) {
      errors.startDate = 'Start date must be in the format YYYYMMDD';
    }

    if (!endDate) {
      errors.endDate = 'End date is required';
    } else if (!/^\d{8}$/.test(endDate)) {
      errors.endDate = 'End date must be in the format YYYYMMDD';
    }

    return errors;
  };
    
  return (
    <div className={styles.contact_page} >
      <div className="container py-5">
        <div className="row justify-content-center align-items-center">
          <div className="py-4 col-12 col-md-6 col-sm-3">
            <div className={styles.contact_form_area}>
              <h3 className={styles.form_heading}>Solar Panel Feasibility Scorer</h3>
              <form
                className={styles.contact_form}
                onSubmit={handleSubmit}
              >
                <h5 className="mt-3">
                    Latitude
                </h5>
                    <input className="axies_input_style" placeholder="73.7245" type="number" value={lat} onChange={(event) => setLat(event.target.value)} />
                  {formErrors.lat && <div className={styles.error}>{formErrors.lat}</div>}

                  <h5 className="mt-3">
                    Longitude
                  </h5>
                    <input  className="axies_input_style" type="number" value={lon} placeholder="101.2345" onChange={(event) => setLon(event.target.value)} />
                  
                  {formErrors.lon && <div className={styles.error}>{formErrors.lon}</div>}
                
                  <h5 className="mt-3">
                    File Number
                  </h5>
                    <input  className="axies_input_style"  type="text" value={fileNumber} onChange={(event) => setFileNumber(event.target.value)} />
                  
                  {formErrors.fileNumber && <div className={styles.error}>{formErrors.fileNumber}</div>}
                
                  <h5 className="mt-3">
                    Start Date
                  </h5>
                    <input  className="axies_input_style" type="number" placeholder="YYYYMMDD" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                  
                  {formErrors.startDate && <div className={styles.error}>{formErrors.startDate}</div>}
                
                  <h5 className="mt-3">
                    End Date
                  </h5>
                    <input  className="axies_input_style" type="number" placeholder="YYYYMMDD" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                  
                  {formErrors.endDate && <div className={styles.error}>{formErrors.endDate}</div>}              
                <button className="axies_input_style" type="submit">
                  Get Result
                </button>
              </form>
            </div>

            {score && (
              <div className="mt-5">
                <h5>Citing Score: {score.toFixed(2)}</h5>
              </div>
            )}

            {imageUrl && (
              <div className="mt-5">
                <h5>Visualization</h5>
                <Image className={styles.image}
                    fill="true"
                    src={imageUrl}
                    alt="Image"
                    height={1000}
                    width={1000}
                  />
                  <button className="axies_input_style">
                  Download
                </button>
              </div>
            )}
                      
          </div>
        </div>
      </div>
    </div>
  );
}
