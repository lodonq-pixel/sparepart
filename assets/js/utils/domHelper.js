export async function loadPartial(targetId, file) {
  const res = await fetch(file);
  document.getElementById(targetId).innerHTML = await res.text();
}

