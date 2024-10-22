# Pandemic Tracker

Pandemic Tracker is a web application that visualizes live COVID-19 data using data fetched from external APIs. The app displays the number of confirmed cases, active cases, recoveries, and deaths globally or by country. Additionally, it generates dynamic charts to represent the data.

## Features

- **Global and Country-specific Data**: View COVID-19 data for the entire world or filter by country.
- **Live Data Fetching**: Data is fetched from an external API (`https://disease.sh/v3/covid-19/`) for real-time updates.
- **Interactive Charts**: Data visualization through pie charts and line charts using **Chart.js**.
- **Autocomplete Search**: Search for specific countries using an autocomplete feature that filters the available countries.
- **Data Table**: Display COVID-19 statistics in a sortable table.
  
## Tech Stack

- **HTML5**: Markup for the page structure.
- **CSS3**: For styling the layout and design.
- **JavaScript (ES6)**: Core logic for fetching data, rendering charts, and updating the UI dynamically.
- **Axios**: For making HTTP requests to the COVID-19 API.
- **Chart.js**: Used to create dynamic and interactive charts for data visualization.
- **jQuery**: To handle dynamic DOM manipulation.
- **DataTables**: A jQuery plugin for creating the interactive, sortable data table.

## APIs Utilized

- [Disease.sh](https://disease.sh/): Provides up-to-date COVID-19 data, including global and country-specific statistics.

## How It Works

1. **Data Fetching**: 
   - The `fetchData()` function sends a request to the API and returns the response data.
   - Two endpoints are utilized:
     - `https://disease.sh/v3/covid-19/all` for global data.
     - `https://disease.sh/v3/covid-19/countries` for country-specific data.

2. **Data Rendering**:
   - The `setData()` function processes the fetched data, calculates percentages, and updates the UI with the confirmed, active, recovered, and death cases.
   - The global data is displayed by default, while country-specific data is displayed when a country is selected via the autocomplete feature.

3. **Charts**:
   - **Pie Chart**: Displays the distribution of active, recovered, and death cases.
   - **Line Charts**: Plot the historical trends of confirmed cases and deaths over time.

4. **Autocomplete Feature**:
   - Users can search for countries via an input field. The app filters the available countries and displays them in a dropdown menu.

5. **Interactive Table**:
   - A sortable and searchable table displays country-level COVID-19 statistics, including the total number of cases, deaths, and recoveries.


## Usage
1. The app fetches live data when the page is loaded and displays global statistics by default.
2. To search for a specific country, use the input box and select a country from the dropdown list.
3. Click the "Global" button to return to the global data view.
4. Charts and data will automatically update based on the selected country or global data.

