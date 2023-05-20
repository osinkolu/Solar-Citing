# NASA Solar Data API Extension

This project was Built for the **TID hackathon**, it extends the capabilities of the NASA API endpoint for solar data by allowing multiple API calls with a single request. It is built using Flask, a popular web framework for Python.

## Getting Started

To get started with the NASA Solar Data API extension, follow the instructions below.

### Prerequisites

- Python 3.x
- Flask (install using `pip install flask`)

### Installation

1. Clone the repository:

   ```bash
   git clone -b Nasa-Extension --single-branch https://github.com/osinkolu/Solar-Citing.git
   
   ```

2.  ```
    cd nasa-solar-data-api-extension

    ```

3.  ```
    pip install -r requirements.txt
    ```
### Usage

1. Start the Flask development server:

```
python app.py

```

2. Open your web browser and navigate to http://localhost:5000.

3. You can now make API calls to retrieve solar data by specifying the required parameters. Refer to the NASA Power API documentation for detailed information about the available endpoints and parameters.

Example API call:

```
GET /api/solar-data?latitude=40.7128&longitude=-74.0060&start_date=2023-01-01&end_date=2023-01-10
```

4. The extension allows you to include multiple API calls in a single request. The response will contain the results for each individual API call.

### Limitations
Please note the following limitations of the NASA Solar Data API extension:

* The original NASA API limits users to one API call per request. This extension allows multiple API calls, but keep in mind that it may affect the response time depending on the number of calls included.
* Since the original NASA API does not require an API key, this extension also does not require any authentication. However, it is recommended to use this extension responsibly and adhere to the usage guidelines provided by NASA.

### Contributing
Contributions to the NASA Solar Data API extension are welcome! If you find any bugs, have feature requests, or would like to contribute enhancements, please open an issue or submit a pull request.

### License
This project is licensed under the MIT License.

### Acknowledgments
This project was developed as part of a personal effort to extend the capabilities of the NASA Power API endpoint. Special thanks to the NASA team for providing the original API and their valuable documentation.