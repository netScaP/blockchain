function handleSubmit(event) {
  event.preventDefault();
  const data = {
    candidateName: event.target.elements.candidateName.value,
    address: event.target.elements.address.value,
  };
  const errorEl = document.getElementById('error');
  if (!data.candidateName || data.candidateName === 'null') {
    errorEl.innerText = 'Укажите имя кандидата';
    return false;
  }
  if (!data.address || data.address === 'null') {
    errorEl.innerText = 'Укажите голосуещего';
    return false;
  }
  axios.post('/', data)
    .then(() => location.reload())
    .catch(err => {
      errorEl.innerText = err.message;
    });
}
const form = document.getElementById('mainForm');
form.addEventListener('submit', handleSubmit);