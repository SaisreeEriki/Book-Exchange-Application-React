import React, { useEffect, useState } from 'react';
import { Table, Image } from 'semantic-ui-react';
import api from '../services/api'; // Assuming this is your api call setup

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/UserService/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>User List</h2>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Contact No.</Table.HeaderCell>
                        <Table.HeaderCell>Profile Picture</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {users.map(user => (
                        <Table.Row key={user.id}>
                            <Table.Cell>{user.name}</Table.Cell>
                            <Table.Cell>{user.email}</Table.Cell>
                            <Table.Cell>{user.contactNo}</Table.Cell>
                            <Table.Cell>
                                <Image
                                    src={user.profilePic || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200'} // Default profile pic if no pic
                                    size="small"
                                    circular
                                />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}

export default UserList;
