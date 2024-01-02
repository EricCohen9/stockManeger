import { LatestOrders } from "../components/LatestOrders";
import OverviewSection from "../components/OverviewSection";
function Home() {
  return (
    <div>
      <div>
        <OverviewSection />
      </div>
      <LatestOrders />
    </div>
  );
}

export default Home;
