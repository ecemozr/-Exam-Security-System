import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Reports() {
    const [checkins, setCheckins] = useState([]);
    const [violations, setViolations] = useState([]);

    async function refresh() {
        setCheckins(await api("/api/reports/checkins"));
        setViolations(await api("/api/reports/violations"));
    }

    useEffect(() => { refresh(); }, []);

    return (
        <div>
            <h3>reports</h3>

            <h4>checkins</h4>
            <div style={{ overflowX:"auto" }}>
                <table border="1" cellPadding="6">
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>exam</th>
                        <th>student</th>
                        <th>ml</th>
                        <th>seat</th>
                        <th>status</th>
                        <th>expected</th>
                        <th>actual</th>
                        <th>time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {checkins.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.exam_id}</td>
                            <td>{c.student_no}</td>
                            <td>{c.ml_result}</td>
                            <td>{c.seat_result}</td>
                            <td>{c.status}</td>
                            <td>{c.expected_seat_code || ""}</td>
                            <td>{c.actual_seat_code || ""}</td>
                            <td>{c.checked_in_at}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <h4>violations</h4>
            <div style={{ overflowX:"auto" }}>
                <table border="1" cellPadding="6">
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>checkin</th>
                        <th>exam</th>
                        <th>student</th>
                        <th>reason</th>
                        <th>time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {violations.map(v => (
                        <tr key={v.id}>
                            <td>{v.id}</td>
                            <td>{v.checkin_id}</td>
                            <td>{v.exam_id}</td>
                            <td>{v.student_no}</td>
                            <td>{v.reason}</td>
                            <td>{v.created_at}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <button onClick={refresh} style={{ marginTop:10 }}>refresh</button>
        </div>
    );
}
