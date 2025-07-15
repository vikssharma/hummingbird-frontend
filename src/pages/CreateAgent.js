import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateAgent = () => {
  const host_uri = 'http://34.229.222.57:5000';
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [tags, setTags] = useState('');
  const [language, setLanguage] = useState('en');
  const [industry, setIndustry] = useState('');
  const [gender, setGender] = useState('');
  const [agentwork, setAgentwork] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [additionalLanguages, setAdditionalLanguages] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [description, setDescription] = useState('');
  const [llm, setLlm] = useState('gpt-4');
  const [voices, setVoices] = useState([]);
  const [voiceId, setVoiceId] = useState('');
  const [documentIds, setDocumentIds] = useState('');
  const [config, setConfig] = useState('{}');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(1);
  // Utility to check if a field is invalid
  const isInvalid = (field, value) => touched[field] && !value;
  const supportedIndustry = [
	  { code: 're', label: 'Retail & E-commerce' },
	  { code: 'hm', label: 'Healthcare and Medical' },
	  { code: 'fb', label: 'Finance & Banking' },
	  { code: 'rs', label: 'Real Estate' },
	  { code: 'et', label: 'Education & Training' },
	  { code: 'ht', label: 'Hospitality & Travel' },
	  { code: 'bk', label: 'Finance & Banking' },
	  { code: 'au', label: 'Automotive' },
	  { code: 'ps', label: 'Professional Services' },
	  { code: 'ts', label: 'Technology & Software' },
	  { code: 'gp', label: 'Government & Public' },
	  { code: 'fo', label: 'Food & Beverage' },
	  { code: 'ma', label: 'Manufacturing' },
	  { code: 'fw', label: 'Fitness & Wellness' },
	  { code: 'ls', label: 'Legal Services' },
	  { code: 'np', label: 'Non-profit' },
	  { code: 'me', label: 'Media & Entertainment' }
	  // Add more as needed
	];
	
	const supportedAgentwork = [
	  { code: 'cs', label: 'Customer Support' },
	  { code: 'os', label: 'Outbound Sales' },
	  { code: 'lq', label: 'Lead Qualification' },
	  { code: 'ht', label: 'Appointment Scheduling' },
	  { code: 'fb', label: 'Site Booking' }
	  // Add more as needed
	];
	
	const supportedLanguages = [
	  { code: 'en', label: 'English' },
	  { code: 'hi', label: 'Hindi' },
	  { code: 'ta', label: 'Tamil' }
	  // Add more as needed
	];
    const [errors, setErrors] = useState({});
	
	const validateStep = () => {
    const newErrors = {};
		if (step === 1) {
		  if (!company.trim()) newErrors.company = 'Company is required.';
		  if (!industry.trim()) newErrors.industry = 'Industry is required.';
		  if (!agentwork.trim()) newErrors.agentwork = 'Role is required.';
		}
		if (step === 2) {
		  if (!name.trim()) newErrors.name = 'Agent name is required.';
		  if (!gender.trim()) newErrors.gender = 'Gender is required.';
		  if (!language.trim()) newErrors.language = 'language is required.';
		  if (!voiceId.trim()) newErrors.voiceId = 'voiceId is required.';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	
	const [openSections, setOpenSections] = useState({
	  agent: true,
	  voice: false,
	  kb: false
	});

    const handleNext = () => {
		if (validateStep()){
			setStep(2);
		}
	};

    const handleBack = () => setStep(1);


	const toggleSection = (section) => {
	  setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
	};
  
  const fetchVoices = async () => {
    try {
      const res = await axios.get(host_uri+`/api/agents/voices`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
      });
      setVoices(res.data)
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  
  useEffect(() => {
    //fetchVoices();
	setStep(1)
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedLanguages = additionalLanguages || [];

    if (checked) {
      updatedLanguages.push(value);
    } else {
      updatedLanguages = updatedLanguages.filter((lang) => lang !== value);
    }
    setAdditionalLanguages(updatedLanguages);
  };
  
  const handleChange = (field) => (e) => {
	  const value = e.target.value;
	  if(field === 'name') {
		setName(e.target.value);
	  }
	  
	  if(field === 'company') {
		setCompany(e.target.value);
	  }
	  
	  if(field === 'gender') {
		setGender(e.target.value);
	  }
	  
	  if(field === 'industry') {
		setIndustry(e.target.value);
	  }
	  
	  if(field === 'agentwork') {
		setAgentwork(e.target.value);
	  }
	  
	  if(field === 'language') {
		setLanguage(e.target.value);
	  }
	  
	  if (value.trim() !== '') {
		setErrors((prev) => ({ ...prev, [field]: '' }));
	  }
	};	

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        host_uri+'/api/agents',
        {
          company,
		  name,
		  gender,
		  industry,
		  agentwork,
		  description,
          language,
          additional_languages: additionalLanguages
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('Agent created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create agent.');
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-1 bg-gray-50 rounded space-y-6">
	<h2 className="text-2xl font-bold mb-4">Create Agent</h2>
      {/* ­Agent Details Section */}
		  <div className="p-2 space-y-3 bg-gray-50">
		    {step === 1 && (
            <>
		    	<div className="w-1/3">
				  <label className={`block font-medium mb-1 ${isInvalid('company', company) ? 'text-red-600' : 'text-black-300'}`}>Your company Name</label>
				  <input
					type="text"
					placeholder="Name of your company"
					onBlur={() => setTouched((prev) => ({ ...prev, company: true }))}
					value={company}
					onChange={handleChange('company')}
					className={`w-full mb-1 px-3 py-2 border rounded ${
							  isInvalid('company', company) ? 'border-red-500' : 'border-gray-300'
							}`}
					required
				  />
				  {errors.company && (
					  <p className="text-red-600 text-sm mt-1">{errors.company}</p>
					)}
				</div>
				<div className="w-1/3">
				  <label className={`block font-medium mb-1 ${isInvalid('industry', industry) ? 'text-red-600' : 'text-black-300'}`}>Name the Industry your business in*</label>
				  <select
					id="industry"
					name="industry"
					value={industry}
					onChange={handleChange('industry')}
					onBlur={() => setTouched((prev) => ({ ...prev, industry: true }))}
					className={`w-full mb-1 px-3 py-2 border rounded ${
							  isInvalid('industry', industry) ? 'border-red-500' : 'border-gray-300'
							}`}
					required
				  >
					<option value="">-- Select Industry --</option>
					{supportedIndustry.map((ind) => (
					  <option key={ind.code} value={ind.code}>
						{ind.label}
					  </option>
					))}
				  </select>
				  {errors.industry && (
					  <p className="text-red-600 text-sm mt-1">{errors.industry}</p>
					)}
				</div>
				<div className="w-1/3">
				  <label className={`block font-medium mb-1 ${isInvalid('agentwork', agentwork) ? 'text-red-600' : 'text-black-300'}`}>What role do you want for agent</label>
				  <select
					id="agentwork"
					name="agentwork"
					value={agentwork}
					onChange={handleChange('agentwork')}
					onBlur={() => setTouched((prev) => ({ ...prev, agentwork: true }))}
					className={`w-full mb-1 px-3 py-2 border rounded ${
							  isInvalid('agentwork', agentwork) ? 'border-red-500' : 'border-gray-300'
							}`}
					required
				  >
					<option value="">-- Select type of work --</option>
					{supportedAgentwork.map((wor) => (
					  <option key={wor.code} value={wor.code}>
						{wor.label}
					  </option>
					))}
				  </select>
				  {errors.agentwork && (
					  <p className="text-red-600 text-sm mt-1">{errors.agentwork}</p>
					)}
				</div>
				<div className="w-2/3">
			  <label className="block font-medium mb-1">Description</label>
			  <textarea placeholder="Describe the desired agent (e.g. sales agent for Real estate company" value={description} onChange={e => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded" required />
			</div>
            </>
			)}
			{step === 2 && (
            <>
			    <div className="w-1/3">
				  <label className={`block font-medium mb-1 ${isInvalid('name', name) ? 'text-red-600' : 'text-black-300'}`}>Agent Name</label>
				  <input
					type="text"
					placeholder="Name of the agent (e.g. Amit, Vikas, Richa, Sam)"
					onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
					value={name}
					onChange={handleChange('name')}
					className={`w-full mb-1 px-3 py-2 border rounded ${
							  isInvalid('name', name) ? 'border-red-500' : 'border-gray-300'
							}`}
					required
				  />
				  {errors.name && (
					  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
					)}
				</div>
				<div className="w-1/3">
				  <label className={`block font-medium mb-1 ${isInvalid('gender', gender) ? 'text-red-600' : 'text-black-300'}`}>Gender of the Agent*</label>
				  <select
					id="gender"
					name="gender"
					value={gender}
					onBlur={() => setTouched((prev) => ({ ...prev, gender: true }))}
					onChange={handleChange('gender')}
					className={`w-full mb-1 px-3 py-2 border rounded ${isInvalid('gender', gender) ? 'border-red-500' : 'border-gray-300'}`}
					required
				  >
					<option value="">-- Select Gender --</option>
					<option key='Female' value='Female'>Female</option>
					<option key='Male' value='Male'>Male</option>
				  </select>
				  {errors.gender && (
					  <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
					)}
				</div>
			    
				<div className="w-1/3">
				  <label className="block font-medium mb-1">Primary Language</label>
				  <select
					id="language"
					name="language"
					value={language}
					onChange={handleChange('language')}
					onBlur={() => setTouched((prev) => ({ ...prev, language: true }))}
					className={`w-full mb-1 px-3 py-2 border rounded ${
								  isInvalid('language', language) ? 'border-red-500' : 'border-gray-300'
								}`}
					required
				  >
					<option value="">-- Select Language --</option>
					{supportedLanguages.map((lang) => (
					  <option key={lang.code} value={lang.code}>
						{lang.label}
					  </option>
					))}
				  </select>
				  {errors.name && (
					  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
					)}
				</div>
				<div className="w-1/3">
				  <label className="block font-medium mb-1">Additional Languages</label>
				  <select
					id="additionalLanguages"
					name="additionalLanguages"
					value={additionalLanguages}
					onChange={(e) =>
					  setAdditionalLanguages(e.target.value)
					}
					className="w-full px-3 py-2 border border-gray-300 rounded"
				  >
					<option value="">-- Select Language --</option>
					{supportedLanguages.map((lang) => (
					  <option key={lang.code} value={lang.code}>
						{lang.label}
					  </option>
					))}
				  </select>
				</div>
				{/*<div className="w-2/3">
				<label className="block mb-1 font-medium">Voice</label>
				<select
				  value={voiceId}
				  onChange={e => setVoiceId(e.target.value)}
				  className="w-full border px-3 py-2 rounded"
				  required
				>
				  <option value="">-- Select Voice --</option>
				  {voices.map(v => (
					<option key={v.voiceId} value={v.voiceId}>
					  {v.name} ({v.labels?.accent || 'N/A'})
					</option>
				  ))}
				</select>
				</div>*/}
				</>
				)}			
		</div>
        {step === 1 && (
          <button type="button" onClick={handleNext} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Next
          </button>
        )}
		{step === 2 && (
		   <div className="flex gap-4 mb-4">
		    <button type="button" onClick={handleBack} className="ml-auto px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
				back
			</button>
			<button type="submit" className="bg-blue-600 text-white py-2 px-2 rounded hover:bg-blue-700">Submit</button>
			</div>
		)}
    </form>
  );
};

export default CreateAgent;
