
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateWorkoutPlan } from '../services/api';
// Import Navbar for consistency
import Navbartwo from '../Components/Navbartwo';

const WorkoutPlan = () => {
  const [formData, setFormData] = useState({
    fitnessLevel: 'Beginner',
    goal: 'weightLoss',
    equipment: [],
    schedule: 'Monday,Wednesday,Friday',
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const equipmentOptions = ['None', 'Barbell', 'Dumbbell', 'Kettlebell', 'Pull-Up Bar', 'Bike', 'Jump Rope'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        equipment: checked
          ? [...prev.equipment, value]
          : prev.equipment.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlan(null);

    // Validate formData
    if (!formData.fitnessLevel || !formData.goal || !formData.schedule.trim()) {
      setError('Please fill in all required fields: fitness level, goal, and schedule.');
      setLoading(false);
      return;
    }

    // Create prompt with strict JSON instruction
    const prompt = `
      Generate a workout plan for a ${formData.fitnessLevel} level user aiming for ${formData.goal}.
      Available equipment: ${formData.equipment.length > 0 ? formData.equipment.join(', ') : 'None'}.
      Training days: ${formData.schedule}.
      Return *only* valid JSON (no additional text, comments, or Markdown headers) in this format:
      [
        {
          "day": "string",
          "exercises": [
            {
              "name": "string",
              "sets": number,
              "reps": "string",
              "rest": "string",
              "description": "string"
            }
          ]
        }
      ]
      Example:
      [
        {
          "day": "Monday",
          "exercises": [
            {
              "name": "Push-ups",
              "sets": 3,
              "reps": "10-12",
              "rest": "60s",
              "description": "Standard push-ups"
            }
          ]
        }
      ]
      Wrap the JSON in \`\`\`json\n and \n\`\`\` markdown.
    `.trim();

    console.log('Generated prompt:', prompt);
    console.log('Request payload:', { prompt });

    if (!prompt || prompt.trim() === '') {
      setError('Invalid prompt generated. Please check your inputs.');
      setLoading(false);
      return;
    }

    try {
      const res = await generateWorkoutPlan({ prompt });
      console.log('Generated Plan:', res);
      if (!res.plan || !Array.isArray(res.plan)) {
        throw new Error('Invalid plan format received from server.');
      }
      setPlan(res.plan);
    } catch (err) {
      console.error('Generate plan error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid for submit button
  const isFormValid = formData.fitnessLevel && formData.goal && formData.schedule.trim();

  return (
    <>
      <Navbartwo />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex flex-col items-center pt-20 relative">
        {/* Glowing Background Design */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-3xl -top-10 -left-10 animate-pulse"></div>
          <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl top-40 right-10 animate-pulse"></div>
        </div>

        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500 animate-pulse mb-8">
          AI Workout Plan Generator
        </h1>
        {loading && (
          <div className="flex items-center gap-2 text-gray-300 mb-6">
            <i className="fas fa-spinner animate-spin text-2xl text-teal-400"></i>
            <p>Generating plan with AI...</p>
          </div>
        )}
        {error && (
          <p className="text-red-400 mb-6 bg-gray-800/50 p-4 rounded-lg shadow-lg animate-pulse">{error}</p>
        )}
        <section className="py-10 w-full max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-gray-800/40 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-semibold text-gray-200 mb-6">
              Customize Your Plan
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-gray-300">
                  <i className="fas fa-user text-teal-400"></i>
                  Fitness Level
                </label>
                <select
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-700 rounded bg-gray-900 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition duration-300"
                >
                  <option value="">Select Fitness Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-gray-300">
                  <i className="fas fa-bullseye text-teal-400"></i>
                  Fitness Goal
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-700 rounded bg-gray-900 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition duration-300"
                >
                  <option value="">Select Goal</option>
                  <option value="weightLoss">Weight Loss</option>
                  <option value="weightGain">Weight Gain</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-gray-300">
                  <i className="fas fa-dumbbell text-teal-400"></i>
                  Available Equipment
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {equipmentOptions.map((equip) => (
                    <label key={equip} className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        name="equipment"
                        value={equip}
                        checked={formData.equipment.includes(equip)}
                        onChange={handleInputChange}
                        className="text-teal-500 focus:ring-teal-500"
                      />
                      {equip}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-gray-300">
                  <i className="fas fa-calendar text-teal-400"></i>
                  Training Days (e.g., Monday,Wednesday,Friday)
                </label>
                <input
                  type="text"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  placeholder="e.g., Monday,Wednesday,Friday"
                  className="p-3 border border-gray-700 rounded bg-gray-900 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition duration-300"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white font-semibold rounded-full shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <i className="fas fa-bolt"></i>
                Generate Plan with AI
              </button>
            </form>
          </div>
        </section>
        {plan && (
          <section className="py-10 w-full max-w-4xl mx-auto px-6 relative z-10 animate-fade-in">
            <h2 className="text-3xl font-semibold text-gray-200 mb-6">
              Your AI-Generated Workout Plan
            </h2>
            <div className="bg-gray-800/40 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700">
              {Array.isArray(plan) ? (
                plan.map((dayPlan, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-200 capitalize">
                      {dayPlan.day}
                    </h3>
                    <ul className="mt-2 space-y-4">
                      {Array.isArray(dayPlan.exercises) ? (
                        dayPlan.exercises.map((exercise, i) => (
                          <li
                            key={i}
                            className="text-gray-300 bg-gray-900/50 p-4 rounded-lg shadow-md"
                          >
                            <strong>{exercise.name || 'Unnamed Exercise'}</strong>: {exercise.sets || 0} sets,{' '}
                            {exercise.reps || '0'} reps, {exercise.rest || '0s'} rest
                            <p className="text-sm text-gray-400">{exercise.description || 'No description'}</p>
                          </li>
                        ))
                      ) : (
                        <p className="text-red-400 bg-gray-800/50 p-4 rounded-lg">Error: Invalid exercises format for {dayPlan.day}</p>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-red-400 bg-gray-800/50 p-4 rounded-lg">Error: Invalid plan format received. Please try again.</p>
              )}
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.2)] hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_5px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="fas fa-redo"></i>
                Regenerate Plan
              </button>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default WorkoutPlan;