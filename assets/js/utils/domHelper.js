export async function loadPartial(targetId, file) {
  const res = await fetch(file);
  document.getElementById(targetId).innerHTML = await res.text();
}

export function updateHotlineNumber(phoneNumber) {
  const formattedNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  const element = document.getElementById('hotline-number');
  if (element) {
    element.textContent = formattedNumber;
  }
}

