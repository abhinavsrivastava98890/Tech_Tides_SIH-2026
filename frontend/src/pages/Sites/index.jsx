import { useState } from 'react';
import SiteListTable from './components/SiteListTable';
import SiteDetail from './components/SiteDetail';

export default function Sites() {
  const [selectedSite, setSelectedSite] = useState(null);

  return (
    <div className="h-full bg-card">
      {selectedSite ? (
        <SiteDetail site={selectedSite} onBack={() => setSelectedSite(null)} />
      ) : (
        <div className="p-6 max-w-7xl mx-auto h-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text">Sites & Sources</h1>
            <p className="text-sm text-muted mt-1">Manage water treatment units across all districts.</p>
          </div>
          <SiteListTable onSelectSite={setSelectedSite} />
        </div>
      )}
    </div>
  );
}
