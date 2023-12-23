# React Window Sandbox

React Window Sandbox is a sample application that demonstrates how to use a virtualized list with infinite scrolling. It uses the `react-window` and `react-window-infinite-loader` libraries, along with an `AutoSizer` component for responsive rendering.

The data for this application is fetched from the Opendatasoft API. It fetches data about cities, and specifically about their population.

## Installation

Before you start, ensure you have [Node.js](https://nodejs.org/) installed on your system.

To install the application:

1. Clone the repository or download the code to your local machine.
2. Navigate to the root directory of the project in your terminal/command prompt.
3. Run `npm install` to install the project dependencies.

## Usage

To start the application:

```bash
npm start
```

This will start the application in development mode. Open http://localhost:3000 to view it in the browser.

To create a production build, you can use:

```bash
npm run build
```

## Features

- The application uses `react-window` to efficiently render a large list of data. This library only renders what is visible in the viewport, which reduces the number of DOM elements and improves performance.
- It uses `react-window-infinite-loader` to enable infinite scrolling. When the user scrolls to the end of the list, the application fetches more data from the server.
- It uses `react-virtualized-auto-sizer` to ensure the list resizes as the browser window resizes.
- It uses `lodash.throttle` to prevent excessive requests to the server. This can be helpful if the user scrolls very quickly.

## Customizing

- The number of items to fetch can be customized by changing the `itemsCount` constant.
- The `Row` component is responsible for rendering each item in the list. You can customize this component to display different data or styles.
- The `loadMoreItems` function is responsible for fetching data. You can modify this function to fetch data from a different source.
