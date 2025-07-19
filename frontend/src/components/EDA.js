import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const EDA = () => {
    const [edaData, setEdaData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/eda")
            .then((response) => response.json())
            .then((data) => setEdaData(data))
            .catch((err) => setError("Error fetching EDA data"));
    }, []);

    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!edaData) return <div className="text-center">Loading EDA Data...</div>;

    // Chart Data
    const placementData = [
        { name: "Placed", value: edaData.placement_distribution.placed },
        { name: "Not Placed", value: edaData.placement_distribution.not_placed },
    ];
    
    const barData = [
        { name: "CGPA", value: edaData.averages.cgpa },
        { name: "Skills", value: edaData.averages.skills },
        { name: "Internships", value: edaData.averages.internships },
        { name: "Projects", value: edaData.averages.projects },
        { name: "Certifications", value: edaData.averages.certifications },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-4">Exploratory Data Analysis (EDA)</h1>

            {/* Summary Stats */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
                <p><strong>Total Records:</strong> {edaData.total_records}</p>
                <p><strong>Placement Rate:</strong> {edaData.placement_rate}%</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Average Feature Values</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Placement Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={placementData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                <Cell fill="#4CAF50" />
                                <Cell fill="#F44336" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default EDA;
