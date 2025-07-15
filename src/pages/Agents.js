import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from 'react-icons/fa';
//import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
//import * as fs from "fs";

const Agents = () => {
  const host_uri = 'http://34.229.222.57:5000';
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedAgentConv, setSelectedAgentConv] = useState(null);
  const [agentDetails, setAgentDetails] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); // For bulk delete
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioRefs = useRef({});
  const [audioInstance, setAudioInstance] = useState(null);

  const handlePlay = (conversationId) => {
	/*
	const audioEl = audioRefs.current[id];
    if (audioEl) {
		audioEl.play().catch(err => console.error('Play error:', err));
		setCurrentAudio(id);
	  } else {
		console.warn('No audio element found for ID:', id);
	  }
	*/  
	try {
      if (audioInstance) {
        audioInstance.pause();
        setAudioInstance(null);
        setCurrentAudio(null);
      }

      const audio = new Audio(host_uri+`/api/agents/audio/${conversationId}`);
      audio.play().catch((err) => {
        console.error('Playback failed:', err);
      });

      setCurrentAudio(conversationId);
      setAudioInstance(audio);

      audio.onended = () => {
        setCurrentAudio(null);
        setAudioInstance(null);
      };
    } catch (err) {
      console.error('Failed to play audio:', err);
    }  
	  
  };

  const handlePause = (id) => {
    audioRefs.current[id]?.pause();
    setCurrentAudio(null);
  };

  const handleViewHistory = async (agent) => {
	  setSelectedAgentConv(agent);
	  setLoadingHistory(true);
	  try {
		const res = await axios.get(host_uri+`/api/agents/conversations/${agent.agent_id}`, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
		  });
		//const data = await res.json();
		setConversations(res.data.conversations);
	  } catch (err) {
		console.error(err);
		setConversations([]);
	  } finally {
		setLoadingHistory(false);
	  }
	};

  const toggleAgentSelection = (id) => {
	  setSelectedIds(prev =>
		prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
	  );
	};

	const handleBulkDelete = async () => {
	  if (!window.confirm(`Delete ${selectedIds.length} selected agents?`)) return;

	  try {
		await Promise.all(
		  selectedIds.map(id =>
			axios.delete(host_uri+`/api/agents/${id}`, {
			  headers: { Authorization: `Bearer ${token}` }
			})
		  )
		);
		toast.success(`✅ Deleted ${selectedIds.length} agent(s)`);
		setSelectedIds([]);
		setSelectedAgent(null);
		fetchAgents(page);
	  } catch (err) {
		toast.error('❌ Bulk delete failed');
	  }
	};

  const fetchAgents = async (page = 1, query = search) => {
    try {
      const res = await axios.get(host_uri+`/api/agents?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, search: query }
      });
      setAgents(res.data.agents);
      setTotalPages(res.data.pages);
      setPage(res.data.page);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  
  const handleViewAgentDetails = async (agent) => {
	  setSelectedAgent(agent);
	  try {
		const res = await axios.get(host_uri+`/api/agents/${agent.agent_id}`, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
		  });
		//const data = await res.json();
		setAgentDetails(res.data);
	  } catch (err) {
		console.error(err);
		setConversations([]);
	  } finally {
		setLoadingHistory(false);
	  }
	};

  useEffect(() => {
    fetchAgents(page);
  }, [page, search]);

  const handleUpdate = async (agent_id, updatedData) => {
    try {
      await axios.put(host_uri+`/api/agents/${agent_id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('✅ Agent updated!');
      fetchAgents(page);
      setSelectedAgent(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update agent.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white">
    <div className="p-6 relative">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Your Agents</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
	  type="text"
	  placeholder="Search agents..."
	  value={search}
	  onChange={e => { setSearch(e.target.value); setPage(1); }}
	/>
      {/* Agent List */}
      <div className="grid gap-4">
        {agents.map(agent => {
		  const isSelected = selectedIds.includes(agent.agent_id);
		  return (
			<div
			  key={agent.agent_id}
			  className={`border p-4 rounded flex justify-between items-center hover:bg-gray-50 ${
				selectedAgent?.agent_id === agent.agent_id ? 'bg-blue-100' : ''
			  }`}
			>
			  <div className=" p-4 bg-white dark:bg-gray-800 ">
				<h3 className="text-lg font-semibold">{agent.name}</h3>
			  
			  <div className="mt-2 flex flex-wrap gap-2">
			  <button onClick={() => handleViewAgentDetails(agent)} className="text-blue-600 hover:underline text-sm">
				  Update
				</button>
			  <button onClick={() => handleViewHistory(agent)} className="text-blue-600 hover:underline text-sm">
				  View Conversation History
				</button>
				</div>
			  </div>	
			  <div className="flex items-center gap-2 ml-4">
				{/* Bulk select checkbox */}
				<input
				  type="checkbox"
				  checked={isSelected}
				  onChange={() => toggleAgentSelection(agent.agent_id)}
				/>

				{/* Trash icon for single delete */}
				<FaTrash
				  onClick={async () => {
					if (!window.confirm('Delete this agent?')) return;
					try {
					  await axios.delete(host_uri+`/api/agents/${agent.agent_id}`, {
						headers: { Authorization: `Bearer ${token}` }
					  });
					  toast.success('🗑️ Agent deleted!');
					  fetchAgents(page);
					  setSelectedAgent(null);
					  setSelectedIds(prev => prev.filter(id => id !== agent.agent_id));
					} catch (err) {
					  toast.error('❌ Failed to delete');
					}
				  }}
				  className="text-red-500 hover:text-red-700 cursor-pointer"
				/>
			  </div>
			</div>
			
		  );
		})}

      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-200 px-4 py-1 rounded"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-200 px-4 py-1 rounded"
        >
          Next
        </button>
      </div>
      
	  {selectedIds.length > 0 && (
		  <div className="mt-4 text-center">
			<button
			  onClick={handleBulkDelete}
			  className="bg-red-600 text-white px-4 py-2 rounded"
			>
			  Delete {selectedIds.length} Selected
			</button>
		  </div>
		)}
	  
      {/* Agent Edit Form Panel */}
      {selectedAgent && (
        <div className="fixed right-0 top-0 h-full w-full sm:w-1/2 lg:w-1/3 bg-white shadow-xl border-l p-6 z-50 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Update Agent</h2>
            <button onClick={() => setSelectedAgent(null)} className="text-gray-600 hover:text-black">✖</button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = {
                name: formData.get('name'),
                description: formData.get('description'),
                first_message: formData.get('first_message'),
                tags: formData.get('tags')?.split(',').map(t => t.trim()).filter(Boolean),
                voice_id: formData.get('voice_id'),
                llm: formData.get('llm'),
              };
              handleUpdate(selectedAgent.agent_id, data);
            }}
          >
            <label className="block font-semibold">Name:</label>
            <input name="name" defaultValue={selectedAgent.name} className="border p-2 mb-3 w-full rounded" />
		    
            <div className=" p-4 bg-white dark:bg-gray-800 "> 			 
            <label className="block font-semibold">Description:</label>
            <textarea name="description" defaultValue={agentDetails.conversation_config.agent.prompt.prompt} className="border p-2 mb-3 w-full rounded" />

            <label className="block font-semibold">First Message:</label>
            <input name="first_message" defaultValue={selectedAgent.first_message} className="border p-2 mb-3 w-full rounded" />

            <label className="block font-semibold">Tags (comma-separated):</label>
            <input name="tags" defaultValue={selectedAgent.tags?.join(', ') || ''} className="border p-2 mb-3 w-full rounded" />

            <label className="block font-semibold">Voice ID:</label>
            <input name="voice_id" defaultValue={selectedAgent.voice_id} className="border p-2 mb-3 w-full rounded" />

            <label className="block font-semibold">LLM (e.g. gpt-4):</label>
            <input name="llm" defaultValue={selectedAgent.llm} className="border p-2 mb-3 w-full rounded" />
			</div>
			
			<label className="block font-semibold mt-4">Upload Document:</label>
			<input
			  type="file"
			  name="document"
			  accept=".pdf,.docx,.txt"
			  onChange={async (e) => {
				const file = e.target.files[0];
				if (!file) return;

				const formData = new FormData();
				formData.append('file', file);

				try {
				  const uploadRes = await axios.post(
					`https://api.elevenlabs.io/v1/convai/knowledge-base/file`,
					formData,
					{
					  headers: {
						'xi-api-key': 'sk_3a977578504e4e1a6faa90c2007ee18724813a018e2e2d23',
					  },
					}
				  );	
				  console.log("docid : " + uploadRes.data.id);	
				  await axios.post(
					host_uri+`/api/agents/${selectedAgent.agent_id}/${uploadRes.data.id}/upload`,
					formData,
					{
					  headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
					  },
					}
				  );
				  toast.success('📄 Document uploaded!');
				} catch (err) {
				  toast.error('❌ Failed to upload document');
				}
			  }}
			  className="border p-2 w-full rounded"
			/>


            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
              Save Changes
            </button>
          </form>
		  <button
			  type="button"
			  className="bg-red-600 text-white px-4 py-2 rounded mt-4"
			  onClick={async () => {
				if (!window.confirm('Are you sure you want to delete this agent?')) return;

				try {
				  await axios.delete(host_uri+`/api/agents/${selectedAgent.agent_id}`, {
					headers: { Authorization: `Bearer ${token}` }
				  });
				  toast.success('🗑️ Agent deleted!');
				  setSelectedAgent(null);
				  fetchAgents(page);
				} catch (err) {
				  toast.error(err.response?.data?.message || 'Delete failed');
				}
			  }}
			>
			  Delete Agent
			</button>
        </div>
      )}
	  {selectedAgentConv && (
		  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
			<div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-2xl">
			  <div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-semibold">Conversation History: {selectedAgentConv.name}</h2>
				<button onClick={() => setSelectedAgentConv(null)} className="text-gray-500">✖</button>
			  </div>
			  
			  {loadingHistory ? (
				<p>Loading...</p>
			  ) : conversations.length > 0 ? (
				<ul className="space-y-4 max-h-[400px] overflow-y-auto">
				  {conversations.map((conv, idx) => (
					<li key={idx} className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
					  <div className="text-sm text-gray-700 dark:text-gray-200">{conv.conversation_id}</div>
					  <div className="text-xs text-gray-500 mt-1">{new Date(conv.start_time_unix_secs).toLocaleString()}</div>
					  <div className="text-xs text-gray-500 mt-1">{conv.call_duration_secs}</div>
					  <button onClick={() => handlePlay(conv.conversation_id)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm" >
						▶️ Play
					</button>
					<button onClick={() => handlePause(conv.conversation_id)} className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 text-sm">
						⏸️ Pause
					</button>
					<audio
						ref={(el) => (audioRefs.current[conv._id] = el)}
						src={host_uri+`/api/agents/audio/${conv.conversation_id}`}
						preload="none"
						onEnded={() => setCurrentAudio(null)}
					  />
					</li>
					
				  ))}
				</ul>
			  ) : (
				<p className="text-sm text-gray-500">No conversations found.</p>
			  )}
			</div>
		  </div>
		)}
	
    </div>
	</div>
  );
};

export default Agents;
