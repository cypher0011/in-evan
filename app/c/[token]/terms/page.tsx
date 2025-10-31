import { getValidatedData } from '../data';
import TermsView from './TermsView'; // The new client component

export const dynamic = 'force-dynamic';

// A mock function to get hotel-specific terms.
// Replace this with your actual database call.
async function fetchHotelTerms(hotelId: string): Promise<string> {
  console.log(`Fetching terms for hotel ${hotelId}...`);
  // In a real app, you would do:
  // const terms = await db.terms.findFirst({ where: { hotelId } });
  // return terms?.text || "Default terms not found.";
  
  // Returning detailed mock data for this example.
  return `
hello_world`;
}

type TermsPageProps = {
  params: {
    token: string;
  };
};

export default async function TermsPage({ params }: TermsPageProps) {
  const { token } = params;
  const { hotel } = await getValidatedData(token);

  // Fetch the dynamic T&C text
  const termsText = await fetchHotelTerms(hotel.id);

  return (
    <TermsView
      token={token}
      hotelName={hotel.name}
      termsText={termsText} // Pass the fetched terms to the client
    />
  );
  
}
