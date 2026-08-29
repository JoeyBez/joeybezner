import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import Loading from "./Loading";
import "./DevPage.css";
import { IoCheckmark, IoTrashOutline } from "react-icons/io5";

export default function DevPage() {
    const [loading, setLoading] = useState(false);
    const [commissions, setCommissions] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const password = import.meta.env.VITE_PASSWORD;

    const [reload, setReload] = useState(false);
    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPrice, setNewPrice] = useState(0);

    const [newStatus, setNewStatus] = useState({ id: "", status: "Waiting" });
    const statusOrder = {
        Waiting: 1,
        "In Progress": 0,
        Done: 2,
    };

    useEffect(() => {
        async function getCommissions() {
            if (searchParams.get("password") != password) return;

            setLoading(true);
            const { data, error } = await supabase.from("commissions").select("*").order("date", { ascending: false });

            if (error) {
                console.error(error);
                return;
            }

            data.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
            data.sort((a, b) => a.date - b.date);
            // console.log(data);
            setCommissions(data);
            setLoading(false);
        }
        getCommissions();
    }, [reload]);

    const getDate = (date) => {
        const full = date.toString().slice(0, 10);
        const month = date.slice(5, 7);
        const day = date.slice(8, 10);
        const year = date.slice(0, 4);

        return `${month}/${day}/${year}`;
    };

    async function addCommission() {
        if (newName == "" || newEmail == "") return;
        setLoading(true);
        const { error } = await supabase
            .from("commissions")
            .insert({ name: newName, email: newEmail, price: newPrice });

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        setNewName("");
        setNewEmail("");
        setNewPrice(0);
        setLoading(false);
        setAdding(false);
        setReload(!reload);
    }

    async function deleteCommission(id) {
        setLoading(true);
        const response = await supabase.from("commissions").delete().eq("id", id);

        setLoading(false);
        setReload(!reload);
    }

    async function updateCommission(n) {
        if (n.id == "") return;

        const { data, error } = await supabase.from("commissions").update({ status: n.status }).eq("id", n.id).select();

        if (error) {
            console.error(error);
            return;
        }

        // console.log(data);
        setReload(!reload);
    }

    useEffect(() => {
        updateCommission(newStatus);
    }, [newStatus]);

    return (
        <div>
            {searchParams.get("password") == password ? (
                <div>
                    <h2>Commisions</h2>
                    <button
                        onClick={() => {
                            if (adding) {
                                addCommission();
                            }
                            setAdding(true);
                        }}
                    >
                        {adding ? "Save" : "Add"}
                    </button>
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="table-container">
                            <table style={{ textAlign: "left" }}>
                                <thead>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Date</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                </thead>
                                <tbody>
                                    {adding && (
                                        <tr>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="email"
                                                    value={newEmail}
                                                    onChange={(e) => setNewEmail(e.target.value)}
                                                />
                                            </td>
                                            <td>Now</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={newPrice}
                                                    onChange={(e) => setNewPrice(e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <div className={`status Waiting`}>Waiting</div>
                                            </td>
                                        </tr>
                                    )}
                                    {commissions.map((c) => (
                                        <tr key={c.id}>
                                            <td>{c.name}</td>
                                            <td>{c.email}</td>
                                            <td>{getDate(c.date)}</td>
                                            <td>{`$${c.price}`}</td>
                                            <td>
                                                <div>
                                                    <select
                                                        value={
                                                            newStatus.id == c.id
                                                                ? newStatus.status
                                                                : c.status.toString()
                                                        }
                                                        onChange={(e) =>
                                                            setNewStatus({ id: c.id, status: e.target.value })
                                                        }
                                                        className={`status ${c.status.toString().replace(" ", "")}`}
                                                    >
                                                        <option value={"Waiting"}>Waiting</option>
                                                        <option value={"In Progress"}>In Progress</option>
                                                        <option value={"Done"}>Done</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td>
                                                <IoTrashOutline
                                                    className="trash"
                                                    onClick={() => deleteCommission(c.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <br />
                        </div>
                    )}
                    <h3>Earnings</h3>
                    <table style={{ textAlign: "left", width: "100%" }}>
                        <thead>
                            <th>Total</th>
                            <th>Projected</th>
                        </thead>
                        <tr>
                            <td>
                                $
                                {commissions
                                    .filter((v) => {
                                        return v.status.toString() == "Done";
                                    })
                                    .reduce((accumulator, current) => {
                                        return accumulator + current.price;
                                    }, 0)}
                            </td>
                            <td>
                                $
                                {commissions.reduce((accumulator, current) => {
                                    return accumulator + current.price;
                                }, 0)}
                            </td>
                        </tr>
                    </table>
                </div>
            ) : (
                <div>Page not found.</div>
            )}
        </div>
    );
}
