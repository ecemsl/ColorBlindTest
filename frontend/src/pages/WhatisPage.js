import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';


function WhatisPage() {
    const [showProtanopia, setShowProtanopia] = useState(false);
    const [showDeuteranopia, setShowDeuteranopia] = useState(false);
    const [showTritanopia, setShowTritanopia] = useState(false);

    return (
        <div>
            <div
                style={{
                    background: 'linear-gradient(90deg, #C52475, #9333ea)',
                    color: 'white',
                    padding: '60px 20px',
                    textAlign: 'center',
                    position: 'relative',
                }}
            >
                <h1 className="text-center mb-4">How Color Vision Works & What Causes Color Blindness</h1>
            </div>
            <Container className="mt-4 mb-5">

                <Card className="mb-4 mt-4 shadow-sm">
                    <Card.Body>
                        <Card.Title>How Color Vision Works</Card.Title>
                        <Card.Text>
                            Inside your eye, there are special cells called photoreceptors on the retina. There are two main types:
                            <ul>
                                <li><strong>Rods</strong> detect black, white, and shades of gray (used in low light)</li>
                                <li><strong>Cones</strong> detect color (used in bright light)</li>
                            </ul>
                            There are 3 types of cones:
                            <ul>
                                <li>S-cones detect blue light</li>
                                <li>M-cones detect green light</li>
                                <li>L-cones detect red light</li>
                            </ul>
                            These cones work together to help you see millions of colors by blending signals from different wavelengths.
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <Card.Title>What Causes Color Blindness? & Types of Color Blindness </Card.Title>
                        <Row>
                            <Col md={7}>
                                <Card.Text>
                                    The most common cause is genetics. Color blindness is usually inherited and passed through the X chromosome,
                                    which is why it's more common in men.
                                    <br /><br />
                                    Color blindness happens when one or more cone types are missing or not working properly:
                                    <ul>
                                        <li><strong>Protanopia</strong> missing red cones</li>
                                        <li><strong>Deuteranopia</strong> missing green cones</li>
                                        <li><strong>Tritanopia</strong> missing blue cones</li>
                                    </ul>
                                    Other less common causes include:
                                    <ul>
                                        <li>Eye diseases like glaucoma</li>
                                        <li>Aging of the eye</li>
                                        <li>Injury to the retina or optic nerve</li>
                                        <li>Some medications or chemicals</li>
                                    </ul>
                                </Card.Text>
                            </Col>
                            <Col md={5} className="text-center">
                                <img
                                    src="/images/image1.png"
                                    alt="Color Vision Diagram"
                                    className="img-fluid mt-3"
                                    style={{ maxHeight: '280px', objectFit: 'contain' }}
                                />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                
                <h4 className="mt-5 mb-3 text-center">See How Colors Appear with Different Types of Color Blindness</h4>
                <Row className="g-4">
                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body className="text-center">
                                <Card.Title>Protanopia</Card.Title>
                                <Form.Check
                                    type="switch"
                                    label={showProtanopia ? 'Color Blind View' : 'Normal View'}
                                    checked={showProtanopia}
                                    onChange={() => setShowProtanopia(!showProtanopia)}
                                    className="mb-3"
                                />
                                <img
                                    src={showProtanopia ? '/images/protan.png' : '/images/normal.jpg'}
                                    alt="Protanopia Comparison"
                                    className="img-fluid"
                                />
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body className="text-center">
                                <Card.Title>Deuteranopia</Card.Title>
                                <Form.Check
                                    type="switch"
                                    label={showDeuteranopia ? 'Color Blind View' : 'Normal View'}
                                    checked={showDeuteranopia}
                                    onChange={() => setShowDeuteranopia(!showDeuteranopia)}
                                    className="mb-3"
                                />
                                <img
                                    src={showDeuteranopia ? "/images/deutan.png" : "/images/normal.jpg"}
                                    alt="Deuteranopia Comparison"
                                    className="img-fluid"
                                />
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body className="text-center">
                                <Card.Title>Tritanopia</Card.Title>
                                <Form.Check
                                    type="switch"
                                    label={showTritanopia ? 'Color Blind View' : 'Normal View'}
                                    checked={showTritanopia}
                                    onChange={() => setShowTritanopia(!showTritanopia)}
                                    className="mb-3"
                                />
                                <img
                                    src={showTritanopia ? '/images/tritan.png' : '/images/normal.jpg'}
                                    alt="Tritanopia Comparison"
                                    className="img-fluid"
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default WhatisPage;
