import React from "react";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/esm/Container";


function HomePage() {
    const navigate = useNavigate();


    return (
        <div style={{ marginBottom: '5rem' }}>
            <div
                style={{
                    background: 'linear-gradient(90deg, #f97316, #9333ea)',
                    color: 'white',
                    padding: '60px 20px',
                    textAlign: 'center',
                    position: 'relative',
                }}
            >
                <h1 style={{ fontSize: '3rem' }}>Welcome to the Color Blind Test</h1>
                <p style={{ fontSize: '1.2rem' }}>
                    This test helps you identify signs of color vision deficiency.
                    You'll be shown a series of images (called Ishihara plates) containing numbers or patterns.

                </p>
                <p style={{ fontSize: '1.2rem' }}>
                    We want you to answer the questions by stating what you see in each image.
                </p>
            </div>
            <Container className="mt-4 text-center">
                <h2>Quick & Easy!</h2>

                <p style={{ fontSize: '1.3rem' }}>
                    At the end of the test, you'll see your results.
                </p>
                <p style={{ fontSize: '1.3rem' }}>
                    No account is needed & no personal data is stored.
                </p>

                <h2 style={{ fontSize: '2.2rem' }}>
                    Click the button below to take the test.

                </h2>
                <div className="mt-4 d-flex justify-content-center">
                    <Button size="lg" variant="primary" onClick={() => navigate('/taketest')}>
                        Take The Test
                    </Button>
                </div>
            </Container>
        </div>

    );
}
export default HomePage;