# Twitter Trends Scraper

A Node.js application that automatically scrapes trending topics from Twitter/X using Selenium WebDriver in headless mode, stores the results in MongoDB, and displays them through a web interface.

## Features

- Automated Twitter/X login and trends scraping
- Headless browser operation (no visible browser window)
- MongoDB integration for data storage
- Web interface for viewing results
- IP address tracking for each scrape
- Proxy support for request routing

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v12 or higher)
- MongoDB (running on default port 27017)
- Chrome browser
- Chrome WebDriver matching your Chrome version

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Neil-Uchiha/stir-assignment.git
cd stir-assignment
```

2. Install dependencies:
```bash
npm install
```

## Configuration
1. Set up .env File:
   - Create a file called .env in the root to store the environment variables. copy the contents of .env.example into it.
   - Provide correct values for the SERVER_BASE and PORT env variables based on where you will execute/host the codebase.

2. Set up MongoDB:
   - Ensure MongoDB is running on localhost or hosted service and provide correct url in the .env file under the MONGOURL var
   - The application will automatically create a database called "twitter_trends"

3. Configure Twitter/X credentials:
   - Update the login credentials in .env for the variables ACC_USERNAME and ACC_PASS.

4. Configure proxy:
   - Create an account in [ProxyMesh](https://proxymesh.com/) for a free 15day trial and use any of the proxy URLs.
   - Copy and paste the URL for the PROXY_URL var in .env
   - If you want to skip using a Proxy service then skip the above steps and comment out line 41 in /scrape_trending.js


## Running the Application

1. Start the server:
```bash
node server.js
```

2. Access the web interface:
   - Open your browser and navigate to `http://localhost:3000` or hosted version(if you hosted the server)
   - Click the "Run Script" button to initiate the scraping process

## How It Works

### Backend Process

1. **Headless Browser Initialization**
   - Creates a Chrome WebDriver instance in headless mode
   - Configures proxy settings if specified

2. **Twitter/X Login**
   - Navigates to Twitter/X login page
   - Automatically enters credentials
   - Handles login process

3. **Trend Scraping**
   - Locates trending topic elements on the home page
   - Extracts text from the first 5 trending topics(will extract all if less than 5)
   - Retrieves current IP address

4. **Data Storage**
   - Generates unique ID for each scrape
   - Creates record with trends, timestamp, and IP
   - Stores data in MongoDB

### Frontend Process

1. **Web Interface**
   - Displays a button to trigger the scraping process
   - Shows loading state while scraping is in progress

2. **Results Display**
   - Lists the top 5 trending topics
   - Shows timestamp of the scrape
   - Displays IP address used for the request
   - Shows full JSON data from MongoDB

## Project Structure

```
.
├── server.js           # Express server setup
├── scrape_trending.js  # Main scraping logic
└── public/
    └── index.html      # Web interface
```


## Limitations

- Requires valid Twitter/X credentials
- Limited to 5 trending topics per scrape
- Depends on Twitter/X's DOM structure (may need updates if Twitter changes their HTML)
- Proxy configuration is optional but recommended to avoid rate limiting

## Troubleshooting

1. **Chrome Driver Issues**
   - Ensure Chrome browser and Chrome Driver versions match
   - Check if Chrome Driver is in system PATH

2. **Scraping Failures**
   - Check console logs for detailed error messages
   - Verify Twitter/X credentials are correct
   - Ensure proxy settings are valid if using a proxy

## Contributing

Feel free to submit issues and enhancement requests!