import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Header, Message, Segment, Loader, Button } from "semantic-ui-react"; // Added Button from Semantic UI

const ViewExchangeRequests = () => {
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get userId from local storage
  const userId = localStorage.getItem("userId");

  // Function to handle status update
  const handleStatusUpdate = (requestId, newStatus) => {
    axios
        .put("http://localhost:3000/api/BookApplication/ExchangeService/exchanges/status", {
            requestId,
            status: newStatus,
        })
        .then((response) => {
            if (
                response.data.message ===
                "Exchange request status updated/rejected successfully" ||
                response.data.message === "Exchange request status updated/accepted successfully"
            ) {
                // Update the status locally without reloading
                setExchangeRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.exchangeId === requestId
                            ? { ...request, status: newStatus }
                            : request
                    )
                );
                // Fetch updated data from the server to reflect the change
                axios
                    .get(`http://localhost:3000/api/BookApplication/ExchangeService/exchanges/user/${userId}`)
                    .then((response) => {
                        // Fetch each exchange request and the book name based on bookId
                        const requestsWithBookNames = response.data.data.map((request) => {
                            return axios
                                .get(`http://localhost:3000/api/BookApplication/BookService/Books/${request.bookId}`)
                                .then((bookResponse) => ({
                                    ...request,
                                    bookName: bookResponse.data.title, // Assuming the book name is in the 'name' field
                                }));
                        });

                        Promise.all(requestsWithBookNames).then((updatedRequests) => {
                            setExchangeRequests(updatedRequests); // Store the updated exchange requests with book names
                            setLoading(false); // Stop loading
                        });
                    })
                    .catch((err) => {
                        setError("Failed to fetch updated exchange requests");
                        setLoading(false);
                    });
            }
        })
        .catch((err) => {
            setError("Failed to update the status");
        });
};

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3000/api/BookApplication/ExchangeService/exchanges/user/${userId}`)
        .then((response) => {
          // Fetch each exchange request and the book name based on bookId
          const requestsWithBookNames = response.data.data.map((request) => {
            return axios
              .get(`http://localhost:3000/api/BookApplication/BookService/Books/${request.bookId}`)
              .then((bookResponse) => ({
                ...request,
                bookName: bookResponse.data.title, // Assuming the book name is in the 'name' field
              }));
          });

          Promise.all(requestsWithBookNames).then((updatedRequests) => {
            setExchangeRequests(updatedRequests); // Store the updated exchange requests with book names
            setLoading(false); // Stop loading
          });
        })
        .catch((err) => {
          setError(err.message); // Handle error
          setLoading(false); // Stop loading
        });
    } else {
      setError("User not logged in");
      setLoading(false); // Stop loading
    }
  }, [userId]);

  if (loading) return <Loader active inline="centered" />; // Display a loader while fetching data
  if (error) return <Message error content={error} />; // Display an error message if something goes wrong

  return (
    <Segment>
      <Header as="h2" textAlign="center" style={{ marginBottom: "20px" }}>
        My Exchange Requests
      </Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Book Name</Table.HeaderCell>
            <Table.HeaderCell>Delivery Method</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell> {/* Added Actions column */}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {exchangeRequests.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="4" textAlign="center">
                No exchange requests found.
              </Table.Cell>
            </Table.Row>
          ) : (
            exchangeRequests.map((request) => (
              <Table.Row key={request.exchangeId}>
                <Table.Cell>{request.bookName}</Table.Cell>
                <Table.Cell>{request.deliveryMethod}</Table.Cell>
                <Table.Cell>{request.status}</Table.Cell>
                <Table.Cell>
                  {request.status === "pending" && (
                    <>
                      <Button
                        primary
                        onClick={() => handleStatusUpdate(request.exchangeId, "accepted")}
                      >
                        Accept
                      </Button>
                      <Button
                        negative
                        onClick={() => handleStatusUpdate(request.exchangeId, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {request.status === "rejected" && (
                    <Button disabled>Rejected</Button>
                  )}
                  {request.status === "accepted" && (
                    <Button disabled>Accepted</Button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </Segment>
  );
};

export default ViewExchangeRequests;
