import React from "react";
import { useState } from "react";
import { useRouter } from 'next/router';
import useDownloader from "react-use-downloader";
import styles from "./contact.module.sass";
import Image from "next/image";

export default function Output(){

  const router = useRouter();

  const prediction = router.query.prediction;
  const error = router.query.error;
  const predictions = router.query.predictions;
  const height = router.query.height;
  const width = router.query.width;
 

    // navigate to a new page to show the output images
  const { download } =
    useDownloader();

    if(prediction?.output?.length > 0) {
      const fileUrl = prediction?.output[prediction?.output.length - 1];
      const filename = fileUrl?.split("/").pop();
    }

  return (
    <div className={styles.contact_page} >
      <div className="container py-5">
        <div className="row justify-content-center align-items-center">
          <div className="py-4 col-12 col-md-6 col-sm-3">
            <div className={styles.contact_form_area}>
              <h3 className={styles.form_heading}>Output</h3>
            </div>
            {error && <div>{error}</div>}

          {prediction && (
            <div className="row">
                {predictions.map((prediction, index ) => (   
                  <div key={index} className="py-4 col-12 col-md-6 col-sm-3" >
                <Image className={styles.image}
                    fill="true"
                    src={prediction[0]}
                    alt="output"
                    height={height}
                    width={width}
                  />
                  <button onClick={() => download(prediction[0] ,filename)} className="axies_input_style">
                  Download
                </button>
                  </div>
                ))}
                <p>status: {prediction.status}</p>
            </div>
          )}            
          </div>
        </div>
      </div>
    </div>
  );
}
