import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";

const PAGE_SIZE = 3; // Number of items per page

const PaginatedList = () => {
  const [data, setData] = useState([]); // Holds list data
  const [page, setPage] = useState(1); // Tracks current page
  const [loading, setLoading] = useState(false); // Loader state
  const [hasMore, setHasMore] = useState(true); // Tracks if more data is available

  // Fetch data function
  const fetchData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Simulating an API call (replace with real API)
      const newData = Array.from({ length: PAGE_SIZE }, (_, i) => `Item ${i + 1 + (page - 1) * PAGE_SIZE}`);
      
      setData([]);
      //setData((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);

      // Check if there is more data
      if (newData.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
  }, []);

  // Trigger pagination when reaching the end of the list
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchData();
    }
  };

  // Render footer loader
  const renderFooter = () => {
    return loading ? <ActivityIndicator size="large" color="blue" style={{ margin: 10 }} /> : null;
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <Text style={{ padding: 20, borderBottomWidth: 1 }}>{item}</Text>}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5} // Adjust this threshold to trigger loading earlier/later
      ListFooterComponent={renderFooter}
    />
  );
};

export default PaginatedList;
