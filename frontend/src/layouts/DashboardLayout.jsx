import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen app-bg">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 min-w-0">
          <Topbar />

          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;