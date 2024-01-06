import { Component, lazy } from 'react';
import PropTypes from 'prop-types';

import {Button, Col, Row, Table, Tabs, Tab, Spinner} from 'react-bootstrap';
import moment from 'moment-timezone';

const PaginationTools = lazy(() => import('../../common/PaginationTools'));
const CreateUserModal = lazy(() => import('./CreateUserModal'));
const DeleteUserModal = lazy(() => import('./DeleteUserModal'));

import {UserConsumer} from '../../data/UserContext';
import defaultAPIErrorHandler from '../../data/defaultAPIErrorHandler';

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'active',
            currentDeleteUser: {firstName: '', lastName: '', role: 'user', id: 0},
            currentPage: 1,
            currentUsers: [],
            hasLoaded: false,
            isLoading: false,
            isTabLoading: false,
            perPage: 25,
            showCreateModal: false,
            showDeleteModal: false,
            softDeleteUser: true,
            totalUsers: 0,
            totalPages: 0
        };

        this.getDeletedUsers = this.getDeletedUsers.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.handleCreateUser = this.handleCreateUser.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
        this.handlePerPageChange = this.handlePerPageChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    componentDidMount() {
        this.getUsers(1);
    }

    getDeletedUsers(page = 1) {
        if (!this.state.isLoading) {
            this.setState({isLoading: true, currentPage: page});

            this.props.api.get('/users/deleted?page=' + page + '&limit=' + this.state.perPage, (resp) => {
                this.setState({
                    currentUsers: resp.users,
                    totalUsers: resp.totalFound.toLocaleString(),
                    totalPages: resp.totalPages,
                    isLoading: false,
                    isTabLoading: false
                });
            }, defaultAPIErrorHandler);
        }
    }

    getUsers(page = 1) {
        if (!this.state.isLoading) {
            this.setState({isLoading: true, currentPage: page});

            this.props.api.get('/users?page=' + page + '&limit=' + this.state.perPage, (resp) => {
                this.setState({
                    currentUsers: resp.users,
                    totalUsers: resp.totalFound.toLocaleString(),
                    totalPages: resp.totalPages,
                    hasLoaded: true,
                    isLoading: false,
                    isTabLoading: false
                });
            }, defaultAPIErrorHandler);
        }
    }

    handleCreateUser(user, onSuccess, onFailure) {
        this.props.api.post({
            url: '/user',
            body: user
        }, (resp) => {
            this.setState({showCreateModal: false}, () => {
                this.getUsers(this.state.currentPage);
                onSuccess();
            });
            alert(user.firstName + ' ' + user.lastName + ' (' + user.role + ') has been created.');
        }, (err, body) => {
            console.error(err);
            alert('The following errors were found:\n\n' + body.errorMessages.join('\n'));
            onFailure();
        });
    }

    handleDeleteUser(after) {
        this.props.api.del({
            url: '/user/' + this.state.currentDeleteUser.id,
        }, (resp) => {
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

    handlePerPageChange(newPar, isDeleted = false) {
        if (newPar !== this.state.perPage) {
            this.setState({perPage: parseInt(newPar), currentPage: 1}, (isDeleted) ? this.getDeletedUsers : this.getUsers);
        }
    }

    handleTabChange(tab) {
        if (tab !== this.state.activeTab) {
            switch (tab) {
                case 'active':
                    this.setState({activeTab: 'active', isTabLoading: true}, this.getUsers);
                    break;
                case 'deleted':
                    this.setState({activeTab: 'deleted', isTabLoading: true}, this.getDeletedUsers);
                    break;
                default:
                    alert('How did you get here?!');
            }
        }
    }

    render() {
        if (!this.state.hasLoaded) {
            return null;
        }

        return (
            <UserConsumer>
                {
                    (user) => (
                        <>
                            <Tabs className="mb-3" onSelect={this.handleTabChange}>
                                <Tab title="Active" eventKey="active" disabled={this.state.isLoading}>
                                    {
                                        (this.state.isTabLoading)
                                            ? <div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>
                                            : <>
                                                <Row className="justify-content-between mb-2">
                                                    <h1 className="col">Users ({this.state.totalUsers})</h1>
                                                    <Col>
                                                        <Button variant="success" className="float-end" onClick={() => this.setState({showCreateModal: true})}>Create</Button>
                                                    </Col>
                                                </Row>

                                                <PaginationTools
                                                    currentPage={this.state.currentPage}
                                                    currentLimit={this.state.perPage}
                                                    totalPages={this.state.totalPages}
                                                    onPerPageChange={(limit) => this.handlePerPageChange(limit)}
                                                    onPageChange={(page) => this.getUsers(page)}
                                                    isDisabled={this.state.isLoading}
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
                                                            this.state.currentUsers.map((thisUser) => (
                                                                <tr key={thisUser.id}>
                                                                    <td>{thisUser.firstName}&nbsp;{thisUser.lastName}{(thisUser.id === user.info.id) ? '\u00A0(me)' : ''}</td>
                                                                    <td>
                                                                        <a href={'mailto:' + encodeURIComponent(thisUser.firstName + ' ' + thisUser.lastName) + '<' + thisUser.email + '>'}>
                                                                            {thisUser.email}
                                                                        </a>
                                                                    </td>
                                                                    <td>{thisUser.role}</td>
                                                                    <td>{moment(thisUser.createdAt).format('l @ LTS').replaceAll(' ', '\u00A0')}</td>
                                                                    <td className="text-end">
                                                                        <Button variant="primary" className="me-lg-2 mb-2 mb-lg-0" onClick={() => {
                                                                            if (thisUser.id === user.info.id) {

                                                                            }
                                                                        }}>Edit</Button>
                                                                        <Button
                                                                            variant="danger"
                                                                            disabled={thisUser.id === user.info.id}
                                                                            onClick={() => this.setState({
                                                                                currentDeleteUser: {id: thisUser.id, firstName: thisUser.firstName, lastName: thisUser.lastName, role: thisUser.role},
                                                                                showDeleteModal: true,
                                                                                softDeleteUser: true
                                                                            })}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                        {
                                                            (this.state.currentUsers.length !== 0)
                                                                ? null
                                                                : <tr>
                                                                    <td colSpan="5" className="text-center">
                                                                        <strong>Nothing Found</strong>
                                                                    </td>
                                                                </tr>
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
                                                            onPageChange={(page) => this.getUsers(page)}
                                                            isDisabled={this.state.isLoading}
                                                        /> : null
                                                }
                                            </>
                                    }
                                </Tab>
                                <Tab title="Deleted" eventKey="deleted" disabled={this.state.isLoading}>
                                    {
                                        (this.state.isTabLoading)
                                            ? <div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>
                                            : <>
                                                <h1 className="mb-3">Deleted Users ({this.state.totalUsers})</h1>

                                                <PaginationTools
                                                    currentPage={this.state.currentPage}
                                                    currentLimit={this.state.perPage}
                                                    totalPages={this.state.totalPages}
                                                    onPerPageChange={(limit) => this.handlePerPageChange(limit, true)}
                                                    onPageChange={(page) => this.getDeletedUsers(page)}
                                                    isDisabled={this.state.isLoading}
                                                />

                                                <Table striped hover responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Email</th>
                                                            <th>Role</th>
                                                            <th>Created At</th>
                                                            <th>Deleted At</th>
                                                            <th />
                                                        </tr>
                                                    </thead>
                                                    <tbody className="align-middle">
                                                        {
                                                            (this.state.isLoading)
                                                                ? <tr>
                                                                    <td colSpan="6" className="text-center">
                                                                        <strong>LOADING...</strong>
                                                                    </td>
                                                                </tr>
                                                                : (this.state.currentUsers.length !== 0)
                                                                    ? this.state.currentUsers.map((user) => (
                                                                        <tr key={user.id}>
                                                                            <td>{user.firstName + '\u00A0' + user.lastName}</td>
                                                                            <td>
                                                                                <a href={'mailto:' + encodeURIComponent(user.firstName + ' ' + user.lastName) + '<' + user.email + '>'}>
                                                                                    {user.email}
                                                                                </a>
                                                                            </td>
                                                                            <td>{user.role}</td>
                                                                            <td>{moment(user.createdAt).format('l @ LTS').replaceAll(' ', '\u00A0')}</td>
                                                                            <td>{moment(user.deletedAt).format('l @ LTS').replaceAll(' ', '\u00A0')}</td>
                                                                            <td className="text-end col-sm">
                                                                                <Button variant="secondary" className="me-xl-2 mb-2 mb-xl-0">Reactivate</Button>
                                                                                <Button
                                                                                    variant="danger"
                                                                                    onClick={() => this.setState({
                                                                                        currentDeleteUser: {id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role},
                                                                                        showDeleteModal: true,
                                                                                        softDeleteUser: false
                                                                                    })}
                                                                                >
                                                                                    Delete
                                                                                </Button>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                    : <tr>
                                                                        <td colSpan="6" className="text-center">
                                                                            <strong>Nothing Found</strong>
                                                                        </td>
                                                                    </tr>
                                                        }
                                                    </tbody>
                                                </Table>

                                                {
                                                    (this.state.currentUsers.length > 5) ?
                                                        <PaginationTools
                                                            currentPage={this.state.currentPage}
                                                            currentLimit={this.state.perPage}
                                                            totalPages={this.state.totalPages}
                                                            onPerPageChange={(limit) => this.handlePerPageChange(limit, true)}
                                                            onPageChange={(page) => this.getDeletedUsers(page)}
                                                            isDisabled={this.state.isLoading}
                                                        /> : null
                                                }
                                            </>
                                    }
                                </Tab>
                            </Tabs>

                            <CreateUserModal onClose={() => this.setState({showCreateModal: false})} onCreate={this.handleCreateUser} show={this.state.showCreateModal} />
                            <DeleteUserModal
                                firstName={this.state.currentDeleteUser.firstName}
                                lastName={this.state.currentDeleteUser.lastName}
                                onAccept={this.handleDeleteUser}
                                onCancel={() => this.setState({showDeleteModal: false})}
                                role={this.state.currentDeleteUser.role}
                                show={this.state.showDeleteModal}
                                softDelete={this.state.softDeleteUser}
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
