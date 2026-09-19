export const jharkhandData = {
  "Ranchi": {
    "Kanke": ["Boriya", "Arsandey", "Pithoria", "Sukurhutu", "Kanke Kasba"],
    "Namkum": ["Tati", "Khijri", "Hulhundu", "Bargawan", "Tetri"],
    "Ratu": ["Pundag", "Kathitand", "Kamre", "Tigol", "Tarup"]
  },
  "East Singhbhum": {
    "Golmuri": ["Mango", "Jugsalai", "Parsudih", "Karandih", "Ghaghidih"],
    "Ghatshila": ["Galudih", "Dhalbhumgarh", "Musabani", "Dumaria", "Gohala"]
  },
  "Dhanbad": {
    "Jharia": ["Bhowra", "Jamadoba", "Digwadih", "Lodna", "Bhaga"],
    "Nirsa": ["Mugma", "Kumardhubi", "Chirkunda", "Panchet", "Maithon"]
  },
  "Hazaribagh": {
    "Sadar": ["Sindoor", "Meru", "Daroo", "Ichak", "Katkamsandi"],
    "Barkagaon": ["Urimari", "Badam", "Gonda", "Keredari", "Sikri"]
  },
  "Bokaro": {
    "Chas": ["Bandhdih", "Kura", "Kala Pathar", "Bhojudih"],
    "Bermo": ["Phusro", "Gomia", "Kathara", "Bokaro Thermal"]
  },
  "Deoghar": {
    "Deoghar": ["Kunda", "Jasidih", "Rohini", "Punasi"],
    "Madhupur": ["Margomunda", "Karon", "Palojori", "Sarath"]
  }
};

export const getDistricts = () => Object.keys(jharkhandData).sort();
export const getBlocks = (district) => district && jharkhandData[district] ? Object.keys(jharkhandData[district]).sort() : [];
export const getVillages = (district, block) => district && block && jharkhandData[district] && jharkhandData[district][block] ? jharkhandData[district][block].sort() : [];
