import { getHotelContext } from '@/lib/utils/hotel-context';
import Link from 'next/link';

/**
 * Customize Item Page - Dynamic customization for selected add-ons
 * Example: If guest selected "flowers", they can choose type, color, message, etc.
 * Route: /c/[token]/customize-[item]
 */

// Force dynamic rendering (no static generation)
export const dynamic = 'force-dynamic';

export default async function CustomizeItemPage({
  params,
}: {
  params: Promise<{ token: string; item: string }>;
}) {
  const resolvedParams = await params;
  const token = resolvedParams.token;
  const item = resolvedParams.item || 'item';

  const context = await getHotelContext();

  if (!context) {
    return <div>Error: Invalid hotel context</div>;
  }

  if (!item || !token) {
    return <div>Error: Missing required parameters</div>;
  }

  // TODO: Fetch the enhance_stay_option by item slug/id
  // TODO: Load customization_schema from database
  // TODO: Dynamically render form based on schema

  // Safely capitalize the item name
  const itemName = item ? item.charAt(0).toUpperCase() + item.slice(1) : 'Item';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center">
          Customize: {itemName}
        </h1>

        <div className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Token: {token} | Hotel: {context.subdomain}
          </p>
          <p className="text-gray-600 text-center">
            Personalize your selection
          </p>
        </div>

        {/* Dynamic Customization Form */}
        <div className="bg-white border rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Customization Options</h2>

          {/* Example: Flowers customization */}
          {item === 'flowers' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Flower Type
                </label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>[Placeholder: Roses]</option>
                  <option>[Placeholder: Tulips]</option>
                  <option>[Placeholder: Mixed Bouquet]</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Color Preference
                </label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>[Placeholder: Red]</option>
                  <option>[Placeholder: White]</option>
                  <option>[Placeholder: Mixed]</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a special message..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Delivery Time
                </label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>[Placeholder: Upon arrival]</option>
                  <option>[Placeholder: Evening]</option>
                  <option>[Placeholder: Specific time]</option>
                </select>
              </div>
            </div>
          )}

          {/* Generic placeholder for other items */}
          {item !== 'flowers' && (
            <div className="space-y-4">
              <p className="text-gray-600">
                [Placeholder: Customization form for {itemName}]
              </p>
              <p className="text-gray-600 text-sm">
                [Form fields will be dynamically generated based on customization_schema from database]
              </p>
            </div>
          )}

          <div className="border-t pt-6 text-sm text-gray-600 space-y-2">
            <p>[UI/UX design pending]</p>
            <p>
              [Customization options stored in customization_schema (JSONB) in enhance_stay_options table]
            </p>
            <p>
              [Guest selections saved to customization (JSONB) in booking_enhancements table]
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Link
            href={`/c/${token}/enhance-stay`}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Back to Enhance Stay
          </Link>
          <Link
            href={`/c/${token}/payment`}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save & Continue
          </Link>
        </div>
      </div>
    </div>
  );
}
