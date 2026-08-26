# Public feed ordering in R3

The server still supplies the selected New / Old / Popular ordering.
R3 applies a small viewer-specific priority layer on top:

1. pinned records;
2. current browser profile's own review;
3. all remaining records in the server-provided order.

The database data is not rewritten by this client-side priority.
