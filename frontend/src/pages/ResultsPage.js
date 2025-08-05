import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResults } from '../services/api';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import ProgressBar from 'react-bootstrap/ProgressBar';


function ResultsPage() {
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const navigate = useNavigate();

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const res = await getResults();
            const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setResults(sorted);
        } catch (err) {
            console.error('Error fetching results:', err);
        }
    };

    const totalPages = Math.ceil(results.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = results.slice(indexOfFirst, indexOfLast);

    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}
            >
                {number}
            </Pagination.Item>
        );
    }


    const formatTimeTaken = (ms) => {
        if (!ms) return '-';
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    

    return (
        <Container className="mt-4">
            <h1 className="text-center">All Test Results</h1>
            <div style={{ marginBottom: '20px' }}>
                <Button onClick={() => navigate('/taketest')}>New Test</Button>
            </div>

            {results.length === 0 ? (
                <p>No results found.</p>
            ) : (
                <>
                    <Table bordered responsive>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Date</th>
                                <th>Time Allowed</th>
                                <th>Time Taken</th>
                                <th>Questions</th>
                                <th>Correct</th>
                                <th>Status</th>
                                <th>Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.user_name}</td>
                                    <td>{new Date(r.date).toLocaleString()}</td>
                                    <td style={{ width: '10%' }}>{`${r.time}m`}</td>
                                    <td>{formatTimeTaken(r.time_taken)}</td>
                                    <td>{r.num_questions}</td>
                                    <td>{r.num_correct_answers}</td>
                                    <td>{r.status}</td>
                                    <td style={{ width: '20%' }}>
                                        <ProgressBar
                                            now={(r.num_correct_answers / r.num_questions) * 100}
                                            style={{ width: '100%' }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {totalPages > 1 && (
                        <Pagination className="justify-content-center flex-wrap">
                            <Pagination.First onClick={() => setCurrentPage(1)} />
                            <Pagination.Prev
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            />
                            {paginationItems}
                            <Pagination.Next
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            />
                            <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
                        </Pagination>
                    )}
                </>
            )}
        </Container>
    );
}

export default ResultsPage;
