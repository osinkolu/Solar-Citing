import pandas as pd
import numpy as np
import requests
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
from flask import Flask,request, jsonify, send_file
from flask_cors import CORS, cross_origin
from geopy.distance import distance
import zipfile


electrical_df = pd.read_csv("useful_resource/electrical_grid_nigeria_15.csv")
market_df = pd.read_csv("useful_resource/GRID3_Nigeria_-_Markets.csv")
electrical_df = electrical_df.rename(columns={'lat':'X', 'lon':'Y'})

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

def replace_missing_data(df):
    """
    Replaces all instances of -999 in a pandas DataFrame with None.
    """
    df = df.replace(to_replace=-999, value=None)
    return df

def add_columns(df, cols):
    """
    Adds up the columns specified in `cols` for a pandas DataFrame `df`
    and returns a new column called 'total' with the sum.
    """
    df['total'] = df[cols].sum(axis=1, skipna=True)
    return df
def average_total(df):
    """
    Calculates the average of the 'total' column in a pandas DataFrame `df`.
    """
    return df['total'].mean()


def visualize_feature_over_time(data, feature_name, file_name):
    """
    Visualizes the specified feature in a pandas DataFrame `data` over time,
    and saves the resulting plot as a PNG file with the specified `file_name`.
    """
    dataframe = data.rename(columns={'YEAR': 'year', 'MO': 'month', 'DY': 'day', 'HR': 'hour'})
    # Create datetime index
    datetime_index = pd.to_datetime(dataframe[['year', 'month', 'day', 'hour']], format='%Y-%m-%d %H:%M:%S')

    # Set the DatetimeIndex as the DataFrame index
    data = data.set_index(datetime_index)
    
    fig, ax = plt.subplots(figsize=(12, 8))

    # Plot the specified feature over time
    plt.plot(data[feature_name])
    plt.xlabel('Date')
    plt.ylabel(feature_name)
    plt.title('{} over Time'.format(feature_name))

    # Save the plot as a PNG file
    plt.savefig(file_name)


def runner(lat, long, start_date, stop_date):

    elevation = get_elevation('true',start_date, stop_date, lat, long)
    data = data_to_dataframe('false',start_date, stop_date, lat, long)
    data['elevation'] = elevation
    data['latitude'] = lat
    data['longitude'] = long
    cols_to_sum = ['ALLSKY_KT', 'ALLSKY_SFC_SW_DWN', 'CLRSKY_KT', 'CLOUD_AMT', 'DIFFUSE_ILLUMINANCE', 'DIRECT_ILLUMINANCE', 'ALLSKY_SFC_UV_INDEX', 'GLOBAL_ILLUMINANCE', 'TS', 'PS', 'T2M', 'SZA', 'ALLSKY_SFC_SW_DIFF', 'ALLSKY_SFC_SW_DNI', 'ALLSKY_SFC_UVA', 'elevation']
    data = replace_missing_data(data)
    data = add_columns(data, cols_to_sum)
    avg_total = average_total(data)
    grid_distance = calc_min_dist_to_infrastructure(lat,long,electrical_df)
    market_distance = calc_min_dist_to_infrastructure(lat,long,market_df)
    for feature in ['ALLSKY_SFC_SW_DWN', 'CLRSKY_KT', 'DIRECT_ILLUMINANCE', 'GLOBAL_ILLUMINANCE', 'CLOUD_AMT']:
        visualize_feature_over_time(data, feature, feature+'.png')
    return([avg_total,grid_distance,market_distance])


def calc_min_dist_to_infrastructure(lat, long, infrastructure_df):
    infra_lat = infrastructure_df.X.tolist()
    infra_long = infrastructure_df.Y.tolist()

    min_length = 1000000
    for _lat,_long in zip(infra_lat, infra_long):
        
        location_1 = (lat, long)
        location_2 = (_lat, _long)
    
        dist = distance(location_1, location_2).km
        if dist < min_length:
            min_length = dist
    return min_length

def zip_all():
    zipf = zipfile.ZipFile('viz.zip','w', zipfile.ZIP_DEFLATED)
    for file in ['ALLSKY_SFC_SW_DWN.png', 'CLRSKY_KT.png', 'DIRECT_ILLUMINANCE.png', 'GLOBAL_ILLUMINANCE.png', 'CLOUD_AMT.png']:
        zipf.write('output/'+file)
    zipf.close()

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
    lat,long,start_date, end_date = (data['lat'], data['lon'], data["start_date"], data["end_date"])
    score = runner(lat, long,start_date, end_date)
    return jsonify(score)

@app.route("/imagex", methods=["GET", "POST"])
@cross_origin()

def imagex():
    data = request.get_json(force=True)
    lat,long, file_number,start_date, end_date = (data['lat'], data['lon'], data['file_number'],data["start_date"], data["end_date"])
    score = runner(lat, long,start_date, end_date)
    filename = ['ALLSKY_SFC_SW_DWN.png', 'CLRSKY_KT.png', 'DIRECT_ILLUMINANCE.png', 'GLOBAL_ILLUMINANCE.png', 'CLOUD_AMT.png']
    return send_file(filename[file_number], mimetype='image/gif')

def imagex_zip():
    data = request.get_json(force=True)
    lat,long, file_number,start_date, end_date = (data['lat'], data['lon'], data['file_number'],data["start_date"], data["end_date"])
    score = runner(lat, long,start_date, end_date)
    zip_all()
    return send_file('viz.zip',
            mimetype = 'zip',
            attachment_filename= 'viz.zip',
            as_attachment = True)


if __name__ =="__main__":
    app.run(host='0.0.0.0', port=8080)
