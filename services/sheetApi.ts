// GANTI URL DI BAWAH INI DENGAN URL DEPLOYMENT GOOGLE SCRIPT ANDA
// Contoh: https://script.google.com/macros/s/XXXXX/exec
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_R5OQYOLye3tpYunVe3fplIL3AtuG7Sh9f773Fy9krxgpexacovX3gtVLb0yj2DdOag/exec";

export const sheetApi = {
  // Ambil Data (GET)
  fetchData: async () => {
    try {
        if (GOOGLE_SCRIPT_URL.includes("GANTI_DENGAN")) {
            console.warn("URL Google Script belum disetting.");
            return null;
        }
        const res = await fetch(GOOGLE_SCRIPT_URL);
        const json = await res.json();
        return json.empty ? null : json;
    } catch (error) {
        console.error("Gagal mengambil data dari Google Sheet:", error);
        throw error;
    }
  },

  // Login (Cek Password di Backend)
  login: async (password: string) => {
    try {
        const res = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({ action: "login", password: password })
        });
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
  },

  // Simpan Data
  saveData: async (content: any, password: string) => {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ 
              action: "save", 
              password: password,
              data: content 
          })
      });
      return await res.json();
  },

  // Upload Gambar ke GDrive
  uploadImage: async (file: File, password: string) => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
              try {
                  const base64String = (reader.result as string).split(',')[1];
                  
                  const res = await fetch(GOOGLE_SCRIPT_URL, {
                      method: 'POST',
                      headers: { "Content-Type": "text/plain" },
                      body: JSON.stringify({
                          action: "upload",
                          password: password,
                          image: base64String,
                          mimeType: file.type
                      })
                  });
                  
                  const data = await res.json();
                  if (data.success) {
                      resolve(data.url);
                  } else {
                      reject(data.message);
                  }
              } catch (err) {
                  reject(err);
              }
          };
          reader.onerror = error => reject(error);
      });
  }
};