import { useState, useEffect } from 'react';
import { FileText, Plus, Filter, Download, Droplet, X } from 'lucide-react';
import { telemetryService } from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useTranslation } from 'react-i18next';

const initialTestResults = [
  { id: 'TST-001', site: 'Site-A (North)', date: '2026-09-15', parameter: 'Fluoride', result: 1.2, limit: 1.5, status: 'Safe' },
  { id: 'TST-002', site: 'Site-B (East)', date: '2026-09-16', parameter: 'Arsenic', result: 0.015, limit: 0.01, status: 'Unsafe' },
  { id: 'TST-003', site: 'Site-C (West)', date: '2026-09-17', parameter: 'Iron', result: 0.4, limit: 0.3, status: 'Warning' },
  { id: 'TST-004', site: 'Site-D (South)', date: '2026-09-18', parameter: 'Fluoride', result: 1.6, limit: 1.5, status: 'Unsafe' },
];

const dummySourceProfiles = [
  { id: 'SRC-101', name: 'Ganga River Point 1', riskLevel: 'High', primaryContaminant: 'Industrial Waste', lastChecked: '2026-09-10' },
  { id: 'SRC-102', name: 'Yamuna River Point 2', riskLevel: 'Critical', primaryContaminant: 'Arsenic, Sewage', lastChecked: '2026-09-12' },
  { id: 'SRC-103', name: 'Local Lake', riskLevel: 'Low', primaryContaminant: 'None', lastChecked: '2026-09-15' },
];

export default function WaterQuality() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('tests');
  const [selectedFilter, setSelectedFilter] = useState('All Parameters');
  const [testResults, setTestResults] = useState(initialTestResults);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewedTest, setViewedTest] = useState(null);

  // Form state
  const [newTest, setNewTest] = useState({
    site: '',
    date: new Date().toISOString().split('T')[0],
    parameter: 'Fluoride',
    result: '',
    limit: '',
    status: 'Safe'
  });

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const response = await telemetryService.getHistory(20);
        if (response.success && response.data) {
          const mappedTests = [];
          response.data.forEach((telemetry, index) => {
            // Map TDS as a test
            mappedTests.push({
              id: `TST-${telemetry.deviceId}-${index}-TDS`,
              site: telemetry.deviceId,
              date: new Date(telemetry.timestamp).toLocaleString(),
              parameter: 'TDS',
              result: telemetry.tds,
              limit: 500,
              status: telemetry.tds < 500 ? 'Safe' : (telemetry.tds < 1000 ? 'Warning' : 'Unsafe')
            });
            // Map Turbidity
            mappedTests.push({
              id: `TST-${telemetry.deviceId}-${index}-TURB`,
              site: telemetry.deviceId,
              date: new Date(telemetry.timestamp).toLocaleString(),
              parameter: 'Turbidity',
              result: telemetry.turbidity,
              limit: 1,
              status: telemetry.turbidity < 1 ? 'Safe' : (telemetry.turbidity < 5 ? 'Warning' : 'Unsafe')
            });
          });
          setTestResults([...initialTestResults, ...mappedTests]);
        }
      } catch (error) {
        console.error('Error fetching real data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRealData();
  }, []);

  const handleAddTest = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSubmitTest = (e) => {
    e.preventDefault();
    const newId = `TST-00${testResults.length + 1}`;
    const testToAdd = {
      id: newId,
      ...newTest,
      result: parseFloat(newTest.result) || 0,
      limit: parseFloat(newTest.limit) || 0,
    };
    setTestResults([testToAdd, ...testResults]);
    setIsAddModalOpen(false);
    // Reset form
    setNewTest({
      site: '',
      date: new Date().toISOString().split('T')[0],
      parameter: 'Fluoride',
      result: '',
      limit: '',
      status: 'Safe'
    });
  };

  const handleExport = () => {
    if (filteredTests.length === 0) {
      alert('No data to export.');
      return;
    }

    const doc = new jsPDF();
    doc.text("Water Quality Tests Report", 14, 15);
    
    const tableColumn = ["Test ID", "Site ID", "Date", "Parameter", "Result", "Limit", "Status"];
    const tableRows = [];

    filteredTests.forEach(test => {
      const testData = [
        test.id,
        test.site,
        test.date,
        test.parameter,
        `${test.result} mg/L`,
        `${test.limit} mg/L`,
        test.status
      ];
      tableRows.push(testData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`water_quality_tests_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const filteredTests = selectedFilter === 'All Parameters' 
    ? testResults 
    : testResults.filter(test => test.parameter === selectedFilter);

  return (
    <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">{t('water_quality_profiles')}</h1>
          <p className="text-sm text-muted mt-1">{t('manage_water_tests')}</p>
        </div>
        <button 
          onClick={handleAddTest}
          className="mt-4 md:mt-0 px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> {t('add_water_test')}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-6 rounded-t-lg shadow-sm">
        <nav className="flex space-x-6 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('tests')}
            className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tests' ? 'border-accent text-primary' : 'border-transparent text-muted hover:text-slate-700'
            }`}
          >
            {t('specialized_test_results')}
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'profiles' ? 'border-accent text-primary' : 'border-transparent text-muted hover:text-slate-700'
            }`}
          >
            {t('source_contamination_profiles')}
          </button>
        </nav>
      </div>

      <div className="bg-card rounded-b-lg shadow-sm border border-border border-t-0 p-6">
        {activeTab === 'tests' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 border border-border rounded-md text-sm text-muted flex items-center hover:bg-card">
                  <Filter className="w-4 h-4 mr-2" /> {t('filter')}
                </button>
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-border rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent text-muted"
                >
                  <option value="All Parameters">{t('all_parameters')}</option>
                  <option value="Fluoride">Fluoride</option>
                  <option value="Arsenic">Arsenic</option>
                  <option value="Iron">Iron</option>
                  <option value="Nitrate">Nitrate</option>
                  <option value="TDS">TDS</option>
                  <option value="Turbidity">Turbidity</option>
                </select>
              </div>
              <button onClick={handleExport} className="px-3 py-1.5 border border-border rounded-md text-sm text-muted flex items-center hover:bg-card">
                <Download className="w-4 h-4 mr-2" /> {t('export')}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-card text-muted uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3 border-b">{t('test_id')}</th>
                    <th className="px-4 py-3 border-b">{t('site_id')}</th>
                    <th className="px-4 py-3 border-b">Date</th>
                    <th className="px-4 py-3 border-b">{t('parameter')}</th>
                    <th className="px-4 py-3 border-b text-right">{t('result')}</th>
                    <th className="px-4 py-3 border-b text-right">{t('limit')}</th>
                    <th className="px-4 py-3 border-b text-center">{t('status')}</th>
                    <th className="px-4 py-3 border-b">{t('report')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
                      <tr key={test.id} className="hover:bg-accent/5 transition-colors">
                        <td className="px-4 py-3 font-medium text-text">{test.id}</td>
                        <td className="px-4 py-3 text-muted">{test.site}</td>
                        <td className="px-4 py-3 text-muted">{test.date}</td>
                        <td className="px-4 py-3 text-muted">{test.parameter}</td>
                        <td className="px-4 py-3 text-right font-medium text-text">{test.result}</td>
                        <td className="px-4 py-3 text-right text-muted">{test.limit}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            test.status === 'Safe' ? 'bg-green-100 text-green-700' : 
                            test.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {test.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => setViewedTest(test)}
                            className="text-accent hover:underline flex items-center text-xs font-medium"
                          >
                            <FileText className="w-3 h-3 mr-1" /> {t('view')}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                        {t('no_records_found')} {selectedFilter}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'profiles' && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-text">{t('source_contamination_profiles')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-card text-muted uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3 border-b">{t('profile_id')}</th>
                    <th className="px-4 py-3 border-b">{t('source_name')}</th>
                    <th className="px-4 py-3 border-b text-center">{t('risk_level')}</th>
                    <th className="px-4 py-3 border-b">{t('primary_contaminant')}</th>
                    <th className="px-4 py-3 border-b">{t('last_checked')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dummySourceProfiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-accent/5">
                      <td className="px-4 py-3 font-medium text-text">{profile.id}</td>
                      <td className="px-4 py-3 text-muted">{profile.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          profile.riskLevel === 'Low' ? 'bg-green-100 text-green-700' : 
                          profile.riskLevel === 'High' ? 'bg-orange-100 text-orange-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {profile.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted">{profile.primaryContaminant}</td>
                      <td className="px-4 py-3 text-muted">{profile.lastChecked}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 bg-accent/10 border border-accent/20 rounded-lg p-4 flex">
           <Droplet className="w-6 h-6 text-primary mr-3 shrink-0" />
           <p className="text-sm text-primary">
             {t('complex_contaminants_note')}
           </p>
        </div>
      </div>

      {/* Add Test Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card w-full max-w-md rounded-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border bg-slate-50/50">
              <h3 className="font-semibold text-lg text-text">{t('add_water_test')}</h3>
              <button onClick={handleCloseModal} className="text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitTest} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Site ID</label>
                <input 
                  type="text" 
                  required
                  value={newTest.site}
                  onChange={(e) => setNewTest({...newTest, site: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" 
                  placeholder="e.g. Site-A (North)" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={newTest.date}
                    onChange={(e) => setNewTest({...newTest, date: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Parameter</label>
                  <select 
                    value={newTest.parameter}
                    onChange={(e) => setNewTest({...newTest, parameter: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <option>Fluoride</option>
                    <option>Arsenic</option>
                    <option>Iron</option>
                    <option>Nitrate</option>
                    <option>TDS</option>
                    <option>Turbidity</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Result (mg/L)</label>
                  <input 
                    type="number" 
                    step="0.001"
                    required
                    value={newTest.result}
                    onChange={(e) => setNewTest({...newTest, result: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" 
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Limit (mg/L)</label>
                  <input 
                    type="number" 
                    step="0.001"
                    required
                    value={newTest.limit}
                    onChange={(e) => setNewTest({...newTest, limit: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" 
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Status</label>
                <select 
                  value={newTest.status}
                  onChange={(e) => setNewTest({...newTest, status: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="Safe">Safe</option>
                  <option value="Warning">Warning</option>
                  <option value="Unsafe">Unsafe</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end space-x-2 border-t border-border">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-border rounded-md text-sm font-medium text-text hover:bg-slate-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  {t('save_test')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Test Modal */}
      {viewedTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card w-full max-w-md rounded-lg shadow-xl overflow-hidden p-6">
            <div className="flex justify-between items-center border-b border-border pb-4 mb-4">
              <h3 className="font-semibold text-lg text-text">{t('test_report')}: {viewedTest.id}</h3>
              <button onClick={() => setViewedTest(null)} className="text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2">
                <span className="text-muted text-sm">Site ID:</span>
                <span className="text-text text-sm font-medium">{viewedTest.site}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted text-sm">Date:</span>
                <span className="text-text text-sm font-medium">{viewedTest.date}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted text-sm">Parameter:</span>
                <span className="text-text text-sm font-medium">{viewedTest.parameter}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted text-sm">Result:</span>
                <span className="text-text text-sm font-medium">{viewedTest.result} mg/L</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted text-sm">Limit:</span>
                <span className="text-text text-sm font-medium">{viewedTest.limit} mg/L</span>
              </div>
              <div className="grid grid-cols-2 items-center">
                <span className="text-muted text-sm">Status:</span>
                <div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-center ${
                    viewedTest.status === 'Safe' ? 'bg-green-100 text-green-700' : 
                    viewedTest.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {viewedTest.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setViewedTest(null)}
                className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
