import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import Reports from "./Reports.jsx";

export default function Admin() {
    const [tab, setTab] = useState("rooms");
    const [rooms, setRooms] = useState([]);
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);

    const refresh = async () => {
        setRooms(await api("/api/admin/rooms"));
        setExams(await api("/api/admin/exams"));
        setStudents(await api("/api/admin/students"));
    };

    useEffect(() => { refresh(); }, []);

    const delRoom = async (id) => {
        if (!window.confirm("delete room?")) return;
        await api(`/api/admin/rooms/${id}`, { method:"DELETE" });
        refresh();
    };

    const delExam = async (id) => {
        if (!window.confirm("delete exam?")) return;
        await api(`/api/admin/exams/${id}`, { method:"DELETE" });
        refresh();
    };

    const delStudent = async (id) => {
        if (!window.confirm("delete student?")) return;
        await api(`/api/admin/students/${id}`, { method:"DELETE" });
        refresh();
    };

    return (
        <div className="main">
            <div className="sidebar">
                <div className={`navitem ${tab==="rooms"?"active":""}`} onClick={()=>setTab("rooms")}>rooms</div>
                <div className={`navitem ${tab==="exams"?"active":""}`} onClick={()=>setTab("exams")}>exams</div>
                <div className={`navitem ${tab==="students"?"active":""}`} onClick={()=>setTab("students")}>students</div>
                <div className={`navitem ${tab==="reports"?"active":""}`} onClick={()=>setTab("reports")}>reports</div>
            </div>

            <div className="content">

                {tab==="rooms" && (
                    <div className="card tablewrap">
                        <h3>rooms</h3>
                        <table>
                            <thead>
                            <tr><th>id</th><th>name</th><th>rows</th><th>cols</th><th></th></tr>
                            </thead>
                            <tbody>
                            {rooms.map(r=>(
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.name}</td>
                                    <td>{r.rows}</td>
                                    <td>{r.cols}</td>
                                    <td>
                                        <button className="btn btn-ghost" onClick={()=>delRoom(r.id)}>delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab==="exams" && (
                    <div className="card tablewrap">
                        <h3>exams</h3>
                        <table>
                            <thead>
                            <tr><th>id</th><th>title</th><th>date</th><th>room</th><th></th></tr>
                            </thead>
                            <tbody>
                            {exams.map(e=>(
                                <tr key={e.id}>
                                    <td>{e.id}</td>
                                    <td>{e.title}</td>
                                    <td>{e.exam_datetime}</td>
                                    <td>{e.room_name}</td>
                                    <td>
                                        <button className="btn btn-ghost" onClick={()=>delExam(e.id)}>delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab==="students" && (
                    <div className="card tablewrap">
                        <h3>students</h3>
                        <table>
                            <thead>
                            <tr><th>id</th><th>no</th><th>name</th><th></th></tr>
                            </thead>
                            <tbody>
                            {students.map(s=>(
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.student_no}</td>
                                    <td>{s.full_name}</td>
                                    <td>
                                        <button className="btn btn-ghost" onClick={()=>delStudent(s.id)}>delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab==="reports" && <Reports />}
            </div>
        </div>
    );
}
