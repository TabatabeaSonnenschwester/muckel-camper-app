import { Routes, Route } from "react-router-dom";
import { AppProvider } from "@/lib/store";
import Layout from "@/components/Layout";
import Start from "@/pages/Start";
import Bauen from "@/pages/Bauen";
import Messen from "@/pages/Messen";
import Gewicht from "@/pages/Gewicht";
import Einkauf from "@/pages/Einkauf";
import Grundriss from "@/pages/Grundriss";

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/bauen" element={<Bauen />} />
          <Route path="/messen" element={<Messen />} />
          <Route path="/gewicht" element={<Gewicht />} />
          <Route path="/einkauf" element={<Einkauf />} />
          <Route path="/grundriss" element={<Grundriss />} />
          <Route path="*" element={<Start />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}
