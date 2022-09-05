import React from 'react';
import PropTypes from 'prop-types';
import {UserConsumer} from '../data/userContext';
import {Button, Col, Row, Table} from 'react-bootstrap';
import moment from 'moment-timezone';
import PaginationTools from '../common/PaginationTools';
import CreateUserModal from './CreateUserModal';
import DeleteUserModal from './DeleteUserModal';

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasLoaded: false,
            currentUsers: [],
            totalUsers: 0,
            totalPages: 0,
            isLoading: false,
            currentPage: 1,
            perPage: 25,
            showCreateModal: false,
            showDeleteModal: false,
            currentDeleteUser: {firstName: '', lastName: '', role: 'user', id: 1}
        };

        this.getUsers = this.getUsers.bind(this);
        this.handlePerPageChange = this.handlePerPageChange.bind(this);
        this.handleCreateUser = this.handleCreateUser.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
    }

    componentDidMount() {
        this.getUsers(1);
    }

    getUsers(page = 1) {
        if (!this.state.isLoading) {
            this.setState({isLoading: true, currentPage: page});

            this.props.api.get('/users?page=' + page + '&limit=' + this.state.perPage, (resp) => {
                this.setState({currentUsers: resp.users, totalUsers: resp.totalFound, totalPages: resp.totalPages, hasLoaded: true, isLoading: false});
            }, (err) => {
                console.error(err);
            });
        }
    }

    handlePerPageChange(newPar) {
        if (newPar !== this.state.perPage) {
            this.setState({perPage: parseInt(newPar), currentPage: 1}, () => this.getUsers(1));
        }
    }

    handleCreateUser(user, onSuccess, onFailure) {
        this.props.api.post({
            url: '/user',
            body: user
        }, (resp) => {
            // console.log(resp);
            this.setState({showCreateModal: false}, () => {this.getUsers(this.state.currentPage); onSuccess();});
            alert(user.firstName + ' ' + user.lastName + ' (' + user.role + ') has been created.');
        }, (err, body) => {
            console.error(err);
            alert('The following errors were found:\n\n' + body.errorMessages.join('\n'));
            onFailure();
        });
    }

    handleDeleteUser(after) {
        this.props.api.del({
            url: '/user',
            body: {id: this.state.currentDeleteUser.id}
        }, (resp) => {
            // console.log(resp);
            this.setState({showDeleteModal: false}, () => {
                this.getUsers(this.state.currentPage);
                alert(this.state.currentDeleteUser.firstName + ' ' + this.state.currentDeleteUser.lastName + ' (' + this.state.currentDeleteUser.role + ') has been deleted.');
                after();
            });
        }, (err, body) => {
            console.error(err);
            alert('The following errors were found:\n\n' + body.errorMessages.join('\n'));
            after();
        });
    }

    render() {
        if (!this.state.hasLoaded) {
            return null;
        }

        return (
            <UserConsumer>
                {
                    (userContext) => (
                        <>
                            <Row className="justify-content-between">
                                <h1 className="col">Users ({this.state.totalUsers})</h1>
                                <Col>
                                    <Button variant="success" className="float-end" onClick={() => this.setState({showCreateModal: true})}>Create</Button>
                                </Col>
                            </Row>
                            <br />
                            <br />

                            <PaginationTools
                                currentPage={this.state.currentPage}
                                currentLimit={this.state.perPage}
                                totalPages={this.state.totalPages}
                                onPerPageChange={(limit) => this.handlePerPageChange(limit)}
                                onPageChange={(page) => this.handlePerPageChange(page)}
                            />

                            <Table striped hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Created At</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody className="align-middle">
                                    {
                                        (!this.state.isLoading) ?
                                            this.state.currentUsers.map((user) => (
                                                <tr key={user.id}>
                                                    <td>{user.firstName} {user.lastName}{(user.id === userContext.user.id) ? ' (me)' : ''}</td>
                                                    <td><a href={'mailto:' + encodeURIComponent(user.firstName + ' ' + user.lastName) + '<' + user.email + '>'}>{user.email}</a></td>
                                                    <td>{user.role}</td>
                                                    <td>{moment(user.createdAt).format('l @ LTS')}</td>
                                                    <td className="text-end">
                                                        <Button
                                                            variant="danger"
                                                            disabled={user.id === userContext.user.id}
                                                            onClick={() => this.setState({
                                                                currentDeleteUser: {id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role},
                                                                showDeleteModal: true
                                                            })}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    <strong>LOADING...</strong>
                                                </td>
                                            </tr>
                                    }
                                    {
                                        (!this.state.isLoading && this.state.currentUsers.length === 0) ?
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    <strong>Nothing Found</strong>
                                                </td>
                                            </tr>
                                            :
                                            null
                                    }
                                </tbody>
                            </Table>

                            {
                                (this.state.currentUsers.length > 5) ?
                                    <PaginationTools
                                        currentPage={this.state.currentPage}
                                        currentLimit={this.state.perPage}
                                        totalPages={this.state.totalPages}
                                        onPerPageChange={(limit) => this.handlePerPageChange(limit)}
                                        onPageChange={(page) => this.handlePerPageChange(page)}
                                    /> : null
                            }

                            <CreateUserModal onClose={() => this.setState({showCreateModal: false})} onCreate={this.handleCreateUser} show={this.state.showCreateModal} />
                            <DeleteUserModal
                                firstName={this.state.currentDeleteUser.firstName}
                                lastName={this.state.currentDeleteUser.lastName}
                                onAccept={this.handleDeleteUser}
                                onCancel={() => this.setState({showDeleteModal: false})}
                                role={this.state.currentDeleteUser.role}
                                show={this.state.showDeleteModal}
                            />
                        </>
                    )
                }
            </UserConsumer>
        );
    }
}

Users.propTypes = {
    api: PropTypes.object.isRequired
};

export default Users;
