import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AgentAnalytics() {
  const [data, setData] = useState([]);
  const [agentFilter, setAgentFilter] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (agentFilter) {
		if(agentFilter != 'all'){
			params.append('agentName', agentFilter);
		}
	}
    if (month) params.append('month', month);
    
    const res = await fetch(`http://localhost:5000/api/analytics?${params.toString()}`, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
		  });
    const json = await res.json();
    setData(json);
	setLoading(false);
  };
  
  const fetchAgents = async () => {
    setLoading(true);
	
	try {
      const res = await axios.get(`http://localhost:5000/api/agents/list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAgents(res.data.agents);
    } catch (err) {
      //setError(err.response?.data?.message || err.message);
    }
	setLoading(false);
  };
  
  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
	setSelectedAgent(agentFilter);
    fetchData();
  }, [agentFilter, month]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">📊 Agent Call Dashboard</h2>
		<div style={{ display: 'flex', gap: '1rem' }}>
        <select value={selectedAgent} onChange={(e) => setAgentFilter(e.target.value)} className="w-auto px-3 py-2 border border-gray-300 rounded">
          <option value="all">All Agents</option>
          {agents.map(agent => (
            <option key={agent.id} value={agent.id}>{agent.name}</option>
          ))}
        </select>
		<select id="month" name="month" value={month}
				onChange={(e) => setMonth(e.target.value)}
				className="w-auto px-3 py-2 border border-gray-300 rounded"
			  >
			<option key='1' value='1'> Jan </option>
			<option key='2' value='2'> Feb </option>
			<option key='3' value='3'> Mar </option>
			<option key='7' value='7'> Jul </option>
		</select>
        </div>
       <hr class="my-4 border-t border-gray-300" />
      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="border px-3 py-2">Agent</th>
			  <th className="border px-3 py-2">Month</th>
              <th className="border px-3 py-2">Calls</th>
              <th className="border px-3 py-2">Avg Duration (s)</th>
              <th className="border px-3 py-2">Est. Cost (₹)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.agent}>
                <td className="border px-3 py-2">{d.agent}</td>
				<td className="border px-3 py-2">{d.month}</td>
                <td className="border px-3 py-2">{d.totalCalls}</td>
                <td className="border px-3 py-2">{d.avgDuration.toFixed(1)}</td>
                <td className="border px-3 py-2">₹{d.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
