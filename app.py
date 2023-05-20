import pandas as pd
import requests
from flask import Flask,request, jsonify
from flask_cors import CORS, cross_origin


parameters = 'ALLSKY_KT%2CALLSKY_SFC_SW_DWN%2CCLRSKY_KT%2CCLOUD_AMT%2CDIFFUSE_ILLUMINANCE%2CDIRECT_ILLUMINANCE%2CALLSKY_SFC_UV_INDEX%2CGLOBAL_ILLUMINANCE%2CTS%2CPS%2CT2M%2CSZA%2CALLSKY_SFC_SW_DIFF%2CALLSKY_SFC_SW_DNI%2CALLSKY_SFC_UVA'


def get_elevation(header, start_date, stop_date, lat, long):
    """
    This return the elevation gotten from the header of the data
    """
    url = f'https://power.larc.nasa.gov/api/temporal/hourly/point?start={start_date}&end={stop_date}&latitude={lat}&longitude={long}&community=ag&parameters={parameters}&format=csv&header={header}&time-standard=utc'
    response = requests.get(url)
    elevation = float(response.text.splitlines()[4].split(' ')[12])
    elevation_text = response.text.splitlines()[4]
    return elevation

def data_to_dataframe(header, start_date, stop_date, lat, long):
    url = f'https://power.larc.nasa.gov/api/temporal/hourly/point?start={start_date}&end={stop_date}&latitude={lat}&longitude={long}&community=ag&parameters={parameters}&format=csv&header={header}&time-standard=utc'
    data = pd.read_csv(url)
    return data


app = Flask(__name__)
cors = CORS(app) #Allow Cross Origin
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
@cross_origin()

def index():
    return("Welcome, please smile more")


@app.route("/scorex", methods=["GET", "POST"])
@cross_origin()

def scorex():
    data = request.get_json(force=True)
    lat,long,start_date, end_date, file_number = (data['lat'], data['lon'], data["start_date"], data["end_date"], data["file_number"])
    data = pd.DataFrame()
    for i,j in zip(lat,long):
        print(i)
        print(j)
        data = data.append(data_to_dataframe('false',start_date, end_date, i, j))
    return jsonify(data.to_dict())


if __name__ =="__main__":
    app.run(host='0.0.0.0', port=8080)
