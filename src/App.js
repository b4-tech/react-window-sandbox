import throttle from "lodash/throttle";
import React, { memo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import "./index.css";

const itemsCount = 500;

const getUrl = (rows, start) =>
  `https://data.opendatasoft.com/api/explore/v2.0/catalog/datasets/worldcitiespop/records?sort=population&fields=population,accentcity&rows=${rows}&start=${start}&facet=country`;

const Row = memo(({ index, style, data }) => {
  const item = data[index];

  if (index + 1 >= itemsCount) return null;

  return (
    <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
      {item ? `${item.accentcity}: ${item.population}` : "Loading..."}
    </div>
  );
});

export default function DataList() {
  const [items, setItems] = useState({});
  const [requestCache, setRequestCache] = useState({});

  const isItemLoaded = ({ index }) => !!items[index];

  const loadMoreItems = (visibleStartIndex, visibleStopIndex) => {
    const key = [visibleStartIndex, visibleStopIndex].join(":");
    if (requestCache[key]) {
      return;
    }

    const length = visibleStopIndex - visibleStartIndex;
    const visibleRange = [...Array(length).keys()].map(
      (x) => x + visibleStartIndex
    );
    const itemsRetrieved = visibleRange.every((index) => !!items[index]);

    if (itemsRetrieved) {
      setRequestCache((prevState) => ({
        ...prevState,
        [key]: key,
      }));
      return;
    }

    return fetch(getUrl(length, visibleStartIndex))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const newItems =
          data?.records?.reduce((acc, city, index) => {
            acc[index + visibleStartIndex] = city.fields;
            return acc;
          }, {}) || {};
        setItems((prevState) => ({
          ...prevState,
          ...newItems,
        }));
      })
      .catch((error) => console.error("Error:", error));
  };

  const loadMoreItemsThrottled = throttle(loadMoreItems, 100);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          loadMoreItems={loadMoreItemsThrottled}
          itemCount={itemsCount}
        >
          {({ onItemsRendered, ref }) => (
            <List
              className="List"
              height={height}
              itemCount={itemsCount}
              itemSize={35}
              width={width}
              ref={ref}
              onItemsRendered={onItemsRendered}
            >
              {(props) => <Row {...props} data={items} />}
            </List>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
}
