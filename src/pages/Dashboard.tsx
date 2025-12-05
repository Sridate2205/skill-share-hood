import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { RequestCard } from '@/components/dashboard/RequestCard';
import { OfferCard } from '@/components/dashboard/OfferCard';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { requests, offers } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const filteredRequests = requests.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOffers = offers.filter(o =>
    o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Neighbourhood Requests Section */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Neighbourhood Requests</h2>
            <div className="space-y-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map(request => (
                  <RequestCard key={request.id} request={request} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No requests yet. Be the first to post!</p>
              )}
            </div>
          </section>

          {/* Skills Offered Section */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Skills Offered Nearby</h2>
            <div className="space-y-4">
              {filteredOffers.length > 0 ? (
                filteredOffers.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No offers yet. Share your skills!</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
