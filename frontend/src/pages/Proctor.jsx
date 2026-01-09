import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import Reports from "./Reports.jsx";

export default function Proctor() {
    const [tab, setTab] = useState("checkin");
    const [exams, setExams] = useState([]);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        api("/api/proctor/exams").then(setExams);
    }, []);

    async function checkin(e) {
        e.preventDefault();
        setMsg("");
        const f = new FormData(e.target);
        try {
            const out = await api("/api/proctor/checkins", { method:"POST", body: f });
            setMsg(JSON.stringify(out, null, 2));
        } catch (ex) {
            setMsg(JSON.stringify(ex, null, 2));
        }
    }

    async function violation(e) {
        e.preventDefault();
        setMsg("");
        const f = new FormData(e.target);
        try {
            const out = await api("/api/proctor/violations", { method:"POST", body: f });
            setMsg(JSON.stringify(out, null, 2));
        } catch (ex) {
            setMsg(JSON.stringify(ex, null, 2));
        }
    }

    return (
        <div className="main">
            <div className="sidebar">
                <div className={"navitem " + (tab==="checkin" ? "active":"")} onClick={()=>setTab("checkin")}>check in</div>
                <div className={"navitem " + (tab==="reports" ? "active":"")} onClick={()=>setTab("reports")}>reports</div>
                <div className={"navitem " + (tab==="help" ? "active":"")} onClick={()=>setTab("help")}>help</div>
            </div>

            <div className="content">
                {tab === "checkin" && (
                    <>
                        <div className="pagehead">
                            <div>
                                <h2>student check in</h2>
                                <div className="sub">capture photo and verify</div>
                            </div>
                        </div>

                        <div className="card">
                            <form onSubmit={checkin} className="formrow3" encType="multipart/form-data">
                                <select name="exam_id">
                                    {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
                                </select>
                                <input name="student_no" placeholder="student no" defaultValue="2207000001" />
                                <input name="actual_seat_code" placeholder="actual seat" defaultValue="A1" />
                                <input name="photo" type="file" accept="image/*" style={{ gridColumn:"1 / -1" }} />
                                <button className="btn btn-primary" style={{ gridColumn:"1 / -1", justifyContent:"center" }}>
                                    submit check in
                                </button>
                            </form>
                        </div>

                        <div className="card">
                            <div style={{ fontWeight:900, marginBottom:10 }}>log violation</div>
                            <form onSubmit={violation} className="formrow" encType="multipart/form-data">
                                <input name="checkin_id" placeholder="checkin id" />
                                <input name="reason" placeholder="reason" />
                                <input name="notes" placeholder="notes" style={{ gridColumn:"1 / -1" }} />
                                <input name="evidence" type="file" accept="image/*" style={{ gridColumn:"1 / -1" }} />
                                <button className="btn btn-primary" style={{ gridColumn:"1 / -1", justifyContent:"center" }}>
                                    submit violation
                                </button>
                            </form>
                        </div>

                        {msg && (
                            <div className="card">
                                <pre style={{ margin:0, whiteSpace:"pre-wrap" }}>{msg}</pre>
                            </div>
                        )}
                    </>
                )}

                {tab === "reports" && <Reports />}

                {tab === "help" && (
                    <div className="card">
                        select exam, enter student no, upload photo, submit<br />
                        flagged çıkarsa violation gir
                    </div>
                )}
            </div>
        </div>
    );
}
