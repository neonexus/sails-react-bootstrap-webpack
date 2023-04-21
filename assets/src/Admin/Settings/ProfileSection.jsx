import {Button, Form, Row} from 'react-bootstrap';
import {useContext, useState} from 'react';
import UserContext from '../../data/UserContext';

function ProfileSection() {
    const user = useContext(UserContext);
    const [firstName, setFirstName] = useState(user.info.firstName);
    const [lastName, setLastName] = useState(user.info.lastName);
    const [email, setEmail] = useState(user.info.email);

    return (
        <>
            <h2 className="mb-3 text-center">Edit Profile</h2>
            <Form onSubmit={(e) => e.preventDefault()}>
                <Row className="ms-0 me-0 mb-2">
                    <Form.FloatingLabel label="First Name" controlId="firstName" className="col-6 ps-0">
                        <Form.Control
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </Form.FloatingLabel>
                    <Form.FloatingLabel label="Last Name" controlId="firstName" className="col-6 p-0">
                        <Form.Control
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </Form.FloatingLabel>
                </Row>
                <Form.FloatingLabel label="Email" controlId="email" className="mb-4">
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.FloatingLabel>
                <Button type="submit" onClick={() => alert('Not done yet')}>Save Changes</Button>
            </Form>
        </>
    );
}

export default ProfileSection;
