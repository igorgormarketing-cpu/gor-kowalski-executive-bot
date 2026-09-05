const key = 'AIzaSyCi737y1NejDeK-CgvxuvXXrucsmgoyuE8';
async function list() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await res.json();
    console.log('Models available:', data.models?.map(m => `${m.name} (${m.supportedGenerationMethods})`));
  } catch(e) {
    console.error(e);
  }
}
list();
