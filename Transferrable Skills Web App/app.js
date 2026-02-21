(function () {
  const form = document.getElementById('profile-form');
  const submitBtn = document.getElementById('submit-btn');
  const resetBtn = document.getElementById('reset-btn');
  const resultsSection = document.getElementById('results-section');
  const resultsContent = document.getElementById('results-content');
  const backBtn = document.getElementById('back-btn');

  function getFormData() {
    const data = {
      age: form.age.value.trim() || undefined,
      location: form.location.value.trim() || undefined,
      skills: form.skills.value.trim() || undefined,
      certifications: form.certifications.value.trim() || undefined,
      work_preferences: form.work_preferences.value.trim() || undefined,
      interests: form.interests.value.trim() || undefined,
      experience: form.experience.value.trim(),
      additional: form.additional.value.trim() || undefined,
    };
    return data;
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Finding your matches…' : 'Get my job recommendations';
  }

  function showResults(text, isError) {
    resultsSection.classList.remove('hidden');
    resultsContent.classList.remove('loading', 'error');
    if (isError) resultsContent.classList.add('error');
    resultsContent.textContent = text;
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showLoading() {
    resultsSection.classList.remove('hidden');
    resultsContent.classList.add('loading');
    resultsContent.textContent = 'Analyzing your profile and matching you with insurance roles…';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function hideResults() {
    resultsSection.classList.add('hidden');
    resultsContent.textContent = '';
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = getFormData();

    if (!data.experience) {
      showResults('Please describe your previous work experience.', true);
      return;
    }

    setLoading(true);
    showLoading();

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        showResults(json.error || 'Something went wrong. Please try again.', true);
        return;
      }

      showResults(json.recommendation || 'No recommendation generated.');
    } catch (err) {
      showResults(
        'Unable to reach the server. Make sure the backend is running and try again.\n\n' + err.message,
        true
      );
    } finally {
      setLoading(false);
    }
  });

  resetBtn.addEventListener('click', function () {
    form.reset();
    hideResults();
  });

  backBtn.addEventListener('click', function () {
    hideResults();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
