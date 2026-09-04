const axios = require('axios');

async function test() {
  try {
    const login = await axios.post('http://localhost:8000/api/login', {
      email: 'owner@example.com',
      password: 'password'
    });
    
    const token = login.data.token;

    const res = await axios.put('http://localhost:8000/api/kost/1', {
      nama: "Kost Sejahtera",
      alamat: "Jl. Kebon Jeruk No. 1",
      no_telepon: "",
      email: "",
      settings: { wifi_aktif: false }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.log("ERROR:", err.response ? err.response.data : err.message);
  }
}
test();
